const core = require('@actions/core');
const github = require('@actions/github');

(async function run() {
  try {
    const token = core.getInput('repo-token', { required: true });
    const pullRequestNumber = github.context.payload.pull_request.number;
    const request = {
      owner: github.context.repo.owner,
      pull_number: github.context.payload.pull_request.number,
      repo: github.context.repo.repo
    };

    const client = new github.GitHub(token);
    const commitsInPR = (await client.pulls.listCommits(request)).data;
    const ticketsList = [];

    if(commitsInPR && commitsInPR.length > 0) {
      const { commit } = commitsInPR[0];
      const matchedTickets = commit.message.matchAll(/\[(.*?)\]/g);
      Array.from(matchedTickets).forEach(match => ticketsList.push(
        `<a href="https://jira.rallyhealth.com/browse/${match[1]}">${match[1]}</a>`
      ));
    }

    const ticketUrls = ticketsList.join(', ');
    const sampleUrl =
      `<a href="https://d1ecjv0s6ub0t4.cloudfront.net/recover-dashboard/pull/${pullRequestNumber}">Cloudfront</a>`;

    const existingBody = (await client.pulls.get(request)).body;
    request['body'] = `${existingBody}

    Jira: ${ticketUrls}
    Sample: ${sampleUrl}`;

    const response = await client.pulls.update(request);

    if (response.status !== 200) {
      core.error('Updating the pull request has failed');
    }
  } catch(error) {
    core.error(error);
    core.setFailed(error.message);
  }
})();
