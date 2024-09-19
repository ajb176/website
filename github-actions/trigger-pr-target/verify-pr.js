const isMemberOfTeam = require('../utils/check-team-membership');
const commentContent = 'You must be a member of the HFLA website team in order to create pull requests. \
Please see our page on how to join us as a member at HFLA: https://www.hackforla.org/getting-started.  \
If you have been though onboarding, and feel this message was sent in error, please message us in the \
#hfla-site team Slack channel with the link to this PR.';

async function main({github,context}) {
    console.log(context.payload.pull_request.base);
    console.log(context.payload.pull_request.head);
    const prAuthor = context.payload.sender.login;  
    const prNumber = context.payload.number;
    const repoFullName = context.payload.repository.full_name; //string: '<repo_owner>/<repo_name>'d
    const ownerRepo = repoFullName.split("/");
    const isMember = await isMemberOfTeam(github, prAuthor, 'website-write');
    if (isMember || prAuthor =='dependabot[bot]') {    
        console.log('Successfully verified!');
    }
    else {
        try {
            await github.rest.issues.update({
                owner : ownerRepo[0],
                repo : ownerRepo[1],
                issue_number : prNumber,
                state : 'closed'
            });
            await github.rest.issues.createComment({
                owner : ownerRepo[0],
                repo : ownerRepo[1],
                issue_number : prNumber,
                body : commentContent
            }); 
        } catch (closeCommentError) {
            console.log(`Failed to close PR #${prNumber} created by ${prAuthor} in the ${repoFullName} repository. See logs for details.`);
            throw closeCommentError;
        } 
    }    
}

module.exports = main;
