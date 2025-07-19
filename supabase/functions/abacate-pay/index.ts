import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, data } = await req.json()
    const API_BASE_URL = 'https://api.abacatepay.com/v1'
    const BEARER_TOKEN = Deno.env.get('ABACATE_PAY_API_KEY')

    if (!BEARER_TOKEN) {
      throw new Error('ABACATE_PAY_API_KEY not configured')
    }

    const headers = {
      'Authorization': `Bearer ${BEARER_TOKEN}`,
      'Content-Type': 'application/json'
    }

    let response: Response
    
    switch (action) {
      case 'createPixQrCode':
        response = await fetch(`${API_BASE_URL}/pixQrCode/create`, {
          method: 'POST',
          headers,
          body: JSON.stringify(data)
        })
        break
        
      case 'checkPaymentStatus':
        response = await fetch(`${API_BASE_URL}/pixQrCode/check?id=${data.paymentId}`, {
          method: 'GET',
          headers
        })
        break
        
      default:
        throw new Error(`Unknown action: ${action}`)
    }

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
    
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})