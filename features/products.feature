Feature: The application can get information about the products from the database.
  when has some products on the database the user will be able to see the products information

  Scenario Outline: getting products
    Given <page> and <pagination> queries, should return <products>
    When the user accesses the route "/products"
    Then should return a status code 200
    And should return a list of products