// Import modules
const statusFieldIds = require('../../utils/_data/status-field-ids');

/**
 * Changes the 'Status' of an issue (with the corresponding itemId) to a newStatusValue
 * @param {String} itemId          -  GraphQL item Id for the issue
 * @param {String} newStatusValue  -  GraphQL Id value of the 'Status' field that the issue is moving to
 *
 */
async function mutateIssueStatus(
  github,
  context,
  itemId,
  newStatusValue
) {
  // Defaults for HfLA Website Project 86
  const WEBSITE_PROJECT_ID = statusFieldIds("WEBSITE_PROJECT_ID");
  const STATUS_FIELD_ID = statusFieldIds("STATUS_FIELD_ID");

  const mutation = `mutation($projectId: ID!, $fieldId: ID!, $itemId: ID!, $value: String!) {
    updateProjectV2ItemFieldValue(input: {
      projectId: $projectId,
      fieldId: $fieldId,
      itemId: $itemId,
      value: {
        singleSelectOptionId: $value
      }
    }) {
      projectV2Item {
        id
      }
    }
  }`;

  const variables = {
    projectId: WEBSITE_PROJECT_ID,
    fieldId: STATUS_FIELD_ID,
    itemId: itemId,
    value: newStatusValue,
  };

  try {
    await github.graphql(mutation, variables);
  } catch (error) {
    throw new Error('Error in mutateIssueStatus() function: ' + error);
  }
}

module.exports = mutateIssueStatus;
