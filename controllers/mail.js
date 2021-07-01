const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendInvitationEmail = async (data) => {  
  const msg = {
    templateId: 'd-3505d3cb6dd4474980cc75a395343253',
    personalizations: [
      {
        //to: data.receiver,
        to: [
          { email: 'joe@pixello.io' }
        ],
        dynamic_template_data: {
          inviterAvatar: data.body.avatar,
          inviterEmail: data.body.inviter,
          companyName: data.body.company
        }
      }
    ],
    from: {
      email: 'support@podworks.app',
      name: 'PodWorks'
    }
  }
  
  //Send email
  await sgMail.send(msg)
  .then((res) => {
    console.log('success')
  })
  .catch(err => console.log('Error', err))
}
