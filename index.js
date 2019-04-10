const getConfig = require('probot-config');
const addLabel = require('./lib/create_label');
const axios = require('axios');
const sendMail = require('./lib/email_sender');

/**
 * Function to check if a key is present in the labels object list
 * @param {String} key 
 * @param {Array<String>} labels 
 */
const checkForLabel = (key, labels) => {
  if (labels && labels.length > 0) {
    // loop through all the label anmes
    labels.forEach(element => {
      if (element.name === key) {
        return true;
      }
    });
  }

  return false;
}

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  // Your code here
  app.log('Yay, the app was loaded!');

  app.on('issue_comment.created', async context => {
    let config = await getConfig(context, 'config.yml');
    console.log(config);
  });

  app.on('pull_request.merged', async context => {
    const pullRequest = context.payload.pull_request;
    const creator = pullRequest.user.login;
    const number = pullRequest.number;
    const labels = pullRequest.labels;
    
    // get the list of changed/new files
    const filesList = await context.github.pullRequests.listFiles(context.issue({
      number: number
    }));

    // get the config data
    const config = await getConfig(context, 'config.yml');
    const { email_recipients } = config;


    // check if the pull request is for a single file
    if (filesList.data.length == 1) {
      // take the first file from the PR
      let file = filesList.data[0];
      // check if the PR is for emails 
      if (file.filename.match(/^emails\//g) && checkForLabel('approved', labels)) {
        //set the label of the PR to email
        await addLabel(context, number, 'SUCCESS');
        // get the contents of the file
        const { data } = await axios.get(file.raw_url);
        console.log(data);
        sendMail(context, email_recipients, pullRequest.title, data);
      }
      // check if the PR is for a new tweet
      else if (file.filename.match(/^tweets\//g) && checkForLabel('approved', labels)) {
        //set the label of the PR to tweet
        await addLabel(context, number, 'SUCCESS');
        //  get the contents of the file
        const { data } = await axios.get(file.raw_url);
        console.log(data);
      }
    }

  });

  app.on('pull_request.opened', async context => {
    const pullRequest = context.payload.pull_request;
    const creator = pullRequest.user.login;
    const number = pullRequest.number;

    // get the list of changed/new files
    const filesList = await context.github.pullRequests.listFiles(context.issue({
      number: number
    }));

    // check if the pull request is for a single file
    if (filesList.data.length == 1) {
      // take the first file from the PR
      let file = filesList.data[0];
      // check if the PR is for emails 
      if (file.filename.match(/^emails\//g)) {
        //set the label of the PR to email
        await addLabel(context, number, 'email');
      }
      // check if the PR is for a new tweet
      else if (file.filename.match(/^tweets\//g)) {
        //set the label of the PR to tweet
        await addLabel(context, number, 'tweet');
        //  get the contents of the file
        const { data } = await axios.get(file.raw_url);
        console.log(data);
      }
    }
  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
