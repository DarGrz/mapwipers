import { supabaseServiceRole } from './supabase'
import { PlaceDetails } from '@/app/types'

// Types for logging
export interface VisitorLog {
  ip_address?: string
  user_agent?: string
  referer?: string
  page_path: string
  country?: string
  city?: string
  session_id?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  gtm_from?: string
}

export interface OrderLog {
  session_id?: string
  customer_email?: string
  customer_name?: string
  company_name?: string
  nip?: string
  phone?: string
  service_type: string
  addons?: string[]
  total_amount: number
  currency?: string
  payment_status?: string
  payment_intent_id?: string
  stripe_session_id?: string
  // GMB/Business information
  business_place_id?: string
  business_name?: string
  business_address?: string
  business_phone?: string
  business_website?: string
  business_rating?: number
  business_google_url?: string
  // Request tracking
  ip_address?: string
  user_agent?: string
  referer?: string
}

export interface SearchedGmbLog {
  session_id?: string
  search_query?: string
  location?: string
  place_id?: string
  place_name?: string
  place_address?: string
  place_phone?: string
  place_website?: string
  place_rating?: number
  place_rating_count?: number
  place_business_status?: string
  place_types?: string[]
  place_geometry?: object
  search_results_count?: number
  ip_address?: string
  user_agent?: string
  referer?: string
}

// Utility functions to extract request info
export function getRequestInfo(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             request.headers.get('remote-addr') || 
             'unknown'
  
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const referer = request.headers.get('referer') || undefined
  
  return {
    ip_address: ip.split(',')[0].trim(), // Take first IP if multiple
    user_agent: userAgent,
    referer
  }
}

// Extract UTM parameters and GTM_FROM from URL
export function extractUtmAndGtmParams(url: string) {
  try {
    const urlObj = new URL(url)
    const params = urlObj.searchParams
    
    return {
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
      utm_term: params.get('utm_term') || undefined,
      utm_content: params.get('utm_content') || undefined,
      gtm_from: params.get('gtm_from') || undefined
    }
  } catch (error) {
    console.error('Error extracting UTM parameters:', error)
    return {
      utm_source: undefined,
      utm_medium: undefined,
      utm_campaign: undefined,
      utm_term: undefined,
      utm_content: undefined,
      gtm_from: undefined
    }
  }
}

export function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Logging functions
export async function logVisitor(data: VisitorLog) {
  try {
    const { error } = await supabaseServiceRole
      .from('visitors')
      .insert([data])
    
    if (error) {
      console.error('Error logging visitor:', error)
      return { success: false, error }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error logging visitor:', error)
    return { success: false, error }
  }
}

export async function logOrder(data: OrderLog) {
  try {
    const { data: result, error } = await supabaseServiceRole
      .from('orders')
      .insert([{
        ...data,
        addons: data.addons || []
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Error logging order:', error)
      return { success: false, error }
    }
    
    return { success: true, data: result }
  } catch (error) {
    console.error('Error logging order:', error)
    return { success: false, error }
  }
}

export async function updateOrderStatus(orderId: string, status: string, paymentIntentId?: string) {
  try {
    const updateData: { payment_status: string; payment_intent_id?: string } = { payment_status: status }
    if (paymentIntentId) {
      updateData.payment_intent_id = paymentIntentId
    }

    const { error } = await supabaseServiceRole
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
    
    if (error) {
      console.error('Error updating order status:', error)
      return { success: false, error }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error updating order status:', error)
    return { success: false, error }
  }
}

export async function logSearchedGmb(data: SearchedGmbLog) {
  try {
    const { error } = await supabaseServiceRole
      .from('searched_gmbs')
      .insert([{
        ...data,
        place_types: data.place_types || [],
        place_geometry: data.place_geometry || null
      }])
    
    if (error) {
      console.error('Error logging searched GMB:', error)
      return { success: false, error }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error logging searched GMB:', error)
    return { success: false, error }
  }
}

// Helper function to log GMB from PlaceDetails
export async function logGmbFromPlaceDetails(
  placeDetails: PlaceDetails,
  searchQuery?: string,
  location?: string,
  sessionId?: string,
  searchResultsCount?: number,
  requestInfo?: { ip_address?: string; user_agent?: string; referer?: string }
) {
  const gmbLog: SearchedGmbLog = {
    session_id: sessionId,
    search_query: searchQuery,
    location: location,
    place_id: placeDetails.id,
    place_name: placeDetails.name,
    place_address: placeDetails.formatted_address || placeDetails.address,
    place_phone: placeDetails.formatted_phone_number || placeDetails.phoneNumber,
    place_website: placeDetails.website,
    place_rating: placeDetails.rating,
    place_rating_count: placeDetails.user_ratings_total,
    place_business_status: placeDetails.businessStatus,
    place_types: placeDetails.types,
    place_geometry: placeDetails.geometry,
    search_results_count: searchResultsCount,
    ip_address: requestInfo?.ip_address,
    user_agent: requestInfo?.user_agent,
    referer: requestInfo?.referer
  }

  return await logSearchedGmb(gmbLog)
}

// Analytics functions
export async function getVisitorStats(startDate?: string, endDate?: string) {
  try {
    let query = supabaseServiceRole
      .from('visitors')
      .select('*')
    
    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error getting visitor stats:', error)
      return { success: false, error }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('Error getting visitor stats:', error)
    return { success: false, error }
  }
}

export async function getOrderStats(startDate?: string, endDate?: string) {
  try {
    let query = supabaseServiceRole
      .from('orders')
      .select('*')
    
    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error getting order stats:', error)
      return { success: false, error }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('Error getting order stats:', error)
    return { success: false, error }
  }
}

export async function getSearchStats(startDate?: string, endDate?: string) {
  try {
    let query = supabaseServiceRole
      .from('searched_gmbs')
      .select('*')
    
    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error getting search stats:', error)
      return { success: false, error }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('Error getting search stats:', error)
    return { success: false, error }
  }
}
