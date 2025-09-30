import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1"
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handler = async (event: any) => {
  console.log('Enviando notificaciones a clientes...');
  
  try {
    for (const record of event.Records) {
      const order = JSON.parse(record.body);
      
      if (order.customerEmail) {
        const emailCommand = new SendEmailCommand({
          Source: process.env.SES_FROM_EMAIL || "noreply@pizzeria.com",
          Destination: {
            ToAddresses: [order.customerEmail]
          },
          Message: {
            Subject: {
              Data: `¡Tu pedido de pizza está en camino! #${order.orderId}`
            },
            Body: {
              Text: {
                Data: `Hola ${order.customerName},\n\nTu orden de ${order.quantity} pizza(s) ${order.pizzaType} ${order.size} está siendo preparada.\n\nTotal: $${order.total}\n\n¡Gracias por tu compra!`
              }
            }
          }
        });
        
        await sesClient.send(emailCommand);
        console.log(`✅ Email enviado a ${order.customerEmail}`);
      } else {
        console.log(`📱 Notificación SMS para ${order.customerPhone}`);
      }
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Notificaciones enviadas a ${event.Records.length} clientes`
      })
    };
  } catch (error) {
    console.error('❌ Error enviando notificaciones:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error enviando notificaciones'
      })
    };
  }
};