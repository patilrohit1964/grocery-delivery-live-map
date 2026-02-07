import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();
  let event;
  try {
    // this is imp for webhook payment identification
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.log(error, "stripe webhook error");
  }
  if (event?.type === "checkout.session.completed") {
    const session = event.data.object;
    await connectDb();
    const paymentUpdate = await Order.findByIdAndUpdate(
      session.metadata?.orderId,
      { isPaid: true },
      { new: true },
    );
  }
}
