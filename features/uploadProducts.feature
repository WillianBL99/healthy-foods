Feature: Uploading files from server to the database

  Scenario: Uploading files from server on the first time
    Given start the server
    And set a <time> to the routine
    When the <time> comes the upload will start
    And all request will be successful
    Then the upload will be successful

  Scenario: Uploading files from server on the second time
    Given start the server
    And set a <time> to the routine
    When the <time> comes the upload will start
    And all request will be successful
    Then the upload will be successful
    And user updated parameters will not be changed by upload