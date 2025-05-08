const responseLib = require("wt-lib").resp;
const axios = require("axios");
const { UserModel, BlogModel, PaymentModel } = require("wt-schemas");
const { message } = require("wt-utils");
const {
  enums: { BLOG_STATUS },
} = require("wt-config");

module.exports = {
  createPaymentLink: async (req, res) => {
    try {
      const { blogId, price, currency } = req.body;
      const blog = await BlogModel.findOne({ _id: blogId });

      if (!blog) {
        return responseLib.error(res, message.BLOG_NOT_FOUND);
      }

      const URL = `${process.env.LEMONSQEEZY_PAYMENT_LINK}?embed=1&media=0&checkout[custom][userId]=${req.user._id}&checkout[custom][blogId]=${blogId}&checkout[custom][currency]=${currency.toLowerCase()}&checkout[custom][amount]=${price}`;
      // //define veriables of lemonsqueezy
      // const storeId = process.env.LEMONSQUEEZY_STORE_ID;
      // const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;
      // const checkoutsApiUrl = process.env.LEMONSQEEZY_CHECKOUT_URL;

      // // Success and cancel URLs
      // const successURL = `${process.env.FRONTEND_URL}/your-stories`;
      // const cancelURL = `${process.env.FRONTEND_URL}/your-stories`;

      // //define the payment link

      // //req-body
      // const requestBody = {
      //   data: {
      //     type: "checkouts",
      //     attributes: {
      //       custom_price: price * 100, // price in cents, convert to dollars by multiplying
      //       checkout_data: {
      //         custom: {
      //           userId: req.user._id.toString(),
      //           blogId: blogId.toString(),
      //           currency: currency.toLowerCase(),
      //           amount: price.toString(),
      //         },
      //         // success_url: successURL, // Add success URL
      //         // cancel_url: cancelURL, // Add cancel URL
      //       },
      //     },
      //     relationships: {
      //       store: {
      //         data: {
      //           type: "stores",
      //           id: storeId,
      //         },
      //       },
      //       variant: {
      //         data: {
      //           type: "variants",
      //           id: variantId,
      //         },
      //       },
      //     },
      //   },
      // };

      // let session = await axios.post(checkoutsApiUrl, requestBody, {
      //   headers: {
      //     Accept: "application/vnd.api+json",
      //     "Content-Type": "application/vnd.api+json",
      //     Authorization: `Bearer ${process.env.LEMONSQEEZY_KEY}`,
      //   },
      // });

      return responseLib.OK({
        res,
        message: message.PAYMENT_LINK_GENERATED,
        payload: {
          paymentLink:URL||"-", 
          // session?.data.data.attributes.url,
          // session: session?.data,
        },
      });
      //   const paymentLink = await generatePaymentLink(blog, price, currency);
    } catch (error) {
      console.log("createPaymentLink", error);
      return responseLib.CATCH_ERROR(res, message.INTERNAL_SERVER_ERROR);
    }
  },

  //webhook for lemonsqueezy
  lemonsqueezyWebhook: async (req, res) => {
    try {
      const jsonData = req.body;
      const event = jsonData.meta.event_name;

      switch (event) {
        case "order_created":
          // Safely access the nested property
          if (
            jsonData.data &&
            jsonData.data.attributes &&
            jsonData.data.attributes.status
          ) {
            const status = jsonData.data.attributes.status;

            if (status === "paid") {
              const SubscribePayload = {
                uid: jsonData.meta.custom_data.userId,
                blogId: jsonData.meta.custom_data.blogId,
                sessionData: jsonData.data,
                paymentId: jsonData.data.id,
                status: "Paid",
                amount: jsonData.meta.custom_data.amount,
              };
              const payment = await PaymentModel.findOne({
                paymentId: jsonData.data.id,
              });
              if (payment) {
                //update the payment status
                await PaymentModel.updateOne(
                  { paymentId: jsonData.data.id },
                  { status: "Paid" }
                );
                return responseLib.OK({
                  res,
                  message: "Payment already confirmed!",
                  payload: {},
                });
              } else {
                await PaymentModel.create(SubscribePayload);
                // Update the blog status to published
                await BlogModel.updateOne(
                  { _id: jsonData.meta.custom_data.blogId },
                  {
                    status: BLOG_STATUS.APPROVED,
                    isActive: true,
                    isPaidBlog: true,
                  }
                );
                return responseLib.OK({
                  res,
                  message: "Payment Confirmed!",
                  payload: {},
                });
              }
            }
          } else {
            console.error("Status property is missing in the payload");
          }
          break;
        default:
          console.log(`Unhandled event type: ${event}`);
      }
    } catch (error) {
      console.error("Error in lemonsqueezyWebhook:", error);
      responseLib.CATCH_ERROR(res);
    }
  },

  //get payment-history by user
  getPaymentHistoryByUser: async (req, res) => {
    try {
      const { blogId, page, limit } = req.query;
      const query = { uid: req.user._id };
      if (blogId) {
        query.blogId = blogId;
      }
      const payments = await PaymentModel.find(query, { sessionData: 0 })
        .populate("blogId")
        .populate("uid")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);

      const payloadData = {
        payments,
        counts: await PaymentModel.countDocuments(query),
      };

      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: payloadData,
      });
    } catch (error) {
      console.log("getPaymentHistory", error);
      return responseLib.error(res, message.INTERNAL_SERVER_ERROR);
    }
  },

  //get payment-history by Admin
  getPaymentHistoryByAdmin: async (req, res) => {
    try {
      const { search, blogId, uid, page, limit } = req.query;
      const query = {};
      if (blogId) {
        query.blogId = blogId;
      }
      if (uid) {
        query.uid = uid;
      }
      if (search) {
        //Find the user by userName or email
        const user = await UserModel.findOne({
          $or : [
            { "userName": { $regex: search, $options: "i" } },
            { "email": { $regex: search, $options: "i" } },
          ]
        },{ _id: 1 });
        query.uid = user?._id;
      }
      const payments = await PaymentModel.find(query, { sessionData: 0 })
        .populate("blogId", "title slugId")
        .populate("uid","userName email")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);

      const payloadData = {
        payments,
        counts: await PaymentModel.countDocuments(query),
      };

      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: payloadData,
      });
    } catch (error) {
      console.log("getPaymentHistory", error);
      return responseLib.error(res, message.INTERNAL_SERVER_ERROR);
    }
  },
};
