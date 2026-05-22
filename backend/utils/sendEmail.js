import nodemailer from 'nodemailer';

const sendOrderEmail = async (orderData) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const productsHtml = orderData.products
            .map(
                (item) => `
      <tr>
        <td style="padding:8px;border:1px solid #ddd;">
          <img 
            src="${item.image}" 
            alt="${item.title}"
            style="
              width:70px;
              height:70px;
              object-fit:cover;
              border-radius:8px;
              display:block;
              margin-bottom:8px;
            "
          />

          <strong>${item.title}</strong>
        </td>

        <td style="padding:8px;border:1px solid #ddd;text-align:center;">
          ${item.quantity}
        </td>

        <td style="padding:8px;border:1px solid #ddd;text-align:center;">
          ₹${item.price}
        </td>
      </tr>
    `
            )
            .join('');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: '🛒 New Order Received - KadaWave',
            html: `
        <h1>New Order Received</h1>

        <h2>Customer Details</h2>
        <p><strong>Name:</strong> <h1>${orderData.name}</h1></p>
        <p><strong>Email:</strong> <h2>${orderData.email}</h2></p>

        <h3>Shipping Address</h3>
        <p>${orderData.address}</p>

        <h3>Ordered Products</h3>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr>
              <th style="padding:8px;border:1px solid #ddd;">Product</th>
              <th style="padding:8px;border:1px solid #ddd;">Quantity</th>
              <th style="padding:8px;border:1px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${productsHtml}
          </tbody>
        </table>

        <h3>Total Amount: ₹${orderData.totalAmount}</h3>
      `,
        };

        await transporter.sendMail(mailOptions);

        console.log('Order email sent successfully');
    } catch (error) {
        console.log('Email error:', error);
    }
};

export default sendOrderEmail;