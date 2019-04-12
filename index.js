const addLabel = require('./lib/create_label');
const sendMail = require('./lib/email_sender');
const {
  getRepoConfig,
  checkIfAdmin,
  getLabels,
  validateEmail,
  obfuscateEmail
} = require('./lib/utils');
const showdown = require('showdown');
const converter = new showdown.Converter();

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  // Your code here
  app.log('Yay, the app was loaded!');
  console.log(process.env.NODE_ENV);

  app.on('issue.opened', async context => {
    console.log(context.payload.issue.title);
    console.log(context.payload.issue.body);
  });

  app.on('issue_comment.created', async context => {
    console.log('ISSUE_COMMENT.CREATED');
    const comment = context.payload.comment;
    const comment_id = comment.id;
    const user = comment.user.login;
    const { number, labels, title, body } = context.payload.issue;
    const { admins, email_recipients } = await getRepoConfig(context);

    // functionality only available for admins
    // return otherwise
    if (!checkIfAdmin(user, admins))
      return;

    // check if the command is to approve a PR
    if (comment.body.match(/^\/approve$/)) {
      return await addLabel(context, number, 'Approved');
    }

    // check if the command is to send email
    if (comment.body.match(/^\/mail\sto\s(.*)$/)) {
      const mailGroup = comment.body.split(' ')[2];
      let recipientName = mailGroup;
      let emails = email_recipients[mailGroup];

      // check if the provided string is a valid email
      // if yes, use that to send the mail to
      if (validateEmail(mailGroup)) {
        console.log('Requested to mail to an email ID');
        emails = [mailGroup];
        recipientName = obfuscateEmail(mailGroup);
        // delete the mail address from comments for privacy concerns
        try {
          await context.github.issues.deleteComment(context.issue({
            comment_id
          }));
          console.log(`Deleted comment ${comment_id} successfully`);
        } catch( err ) {
          console.error(`Unable to delete the comment: ${ comment_id }`);
        }
      
      } else if (!emails || emails.length < 1) {
        // return if the provided ,ail group isn't present in the config file
        return await context.github.issues.createComment(context.issue({
          body: `Uh oh! I coudn't find any emails under the email group '${mailGroup}' in the config file.
          check if the entry is present inside .github/news-room.yml file of this repo.
          `
        }));
      }

      // check if the issue is approved
      const labelNames = getLabels(labels);
      if (!labelNames.includes('Approved')) {
        return await context.github.issues.createComment(context.issue({
          body: `Hold Up! this issue isn't approved yet. Request an admin to approve this issue or if you are an admin, comment \`/approve\` to approve this issue.`
        }));
      }

      // get the email subeject from the issue title
      const emailSubject = title;
      // generate the HTML content of the body from the issue body (Markdown)
      const emailBody = converter.makeHtml(body);
      
      sendMail(context, emails, emailSubject, emailBody, recipientName);
    }

  });
}
