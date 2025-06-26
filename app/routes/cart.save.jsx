import { json } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function action({ request }) {
  try {
    const { customerId, email, lineItems } = await request.json();

    if (!email) return json({ error: "Email is required" }, { status: 400 });

    const existingCart = await prisma.cart.findFirst({ where: { email } });

    if (existingCart) {
      if (!lineItems.length) {
        await prisma.cart.delete({ where: { id: existingCart.id } });
        return json({
          message: "Cart deleted",
          cart: { email, lineItems: [], addedDate: new Date() },
        });
      }

      const updatedCart = await prisma.cart.update({
        where: { id: existingCart.id },
        data: {
          lineItems: {
            deleteMany: {}, // Clear old items
            createMany: {
              data: lineItems.map((item) => ({
                variantId: item.variantId,
                quantity: item.quantity,
                properties: item.properties || {},
              })),
            },
          },
          addedDate: new Date(),
        },
        include: { lineItems: true },
      });

      return json({ message: "Cart updated", cart: updatedCart });
    }

    if (!lineItems.length) {
      return json({ message: "Cart is empty, nothing to save" }, { status: 400 });
    }

    const newCart = await prisma.cart.create({
      data: {
        customerId,
        email,
        addedDate: new Date(),
        lineItems: {
          createMany: {
            data: lineItems.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              properties: item.properties || {},
            })),
          },
        },
      },
      include: { lineItems: true },
    });

    return json({ message: "Cart saved", cart: newCart });
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
