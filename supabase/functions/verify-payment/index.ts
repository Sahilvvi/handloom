import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const RAZORPAY_SECRET = Deno.env.get('RAZORPAY_SECRET')

serve(async (req) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, internal_order_id } = await req.json()

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = await hmac_sha256(body, RAZORPAY_SECRET)

    if (expectedSignature !== razorpay_signature) {
        return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 })
    }

    // Update order status in Supabase
    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error } = await supabase
        .from('orders')
        .update({ status: 'paid', razorpay_order_id: razorpay_payment_id })
        .eq('id', internal_order_id)

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
})

async function hmac_sha256(message: string, secret: string) {
    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    )
    const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message))
    return Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
}
