Feature: The application can get information about the products from the database.
  when has some products on the database the user will be able to see the products information

  Scenario Outline: The user can see the products information
    Given the user has some products on the database
    When the user access the route "/products"
    Then the user should see the products information with default pagination "?pagination=25"