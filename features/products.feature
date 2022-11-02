Feature: Getting the products from the database
  Scenario: getting products
    Given <page> and <pagination> queries, should return <products>
    When the user accesses the route "/products"
    Then should return a status code 200
    And should return a list of <products>

    Examples:
      | page | pagination | products                             |
      | 0    | 2          | [<product1>, <product2>]             |
      | 1    | 2          | [<product3>, <product4>]             |
      | 2    | 2          | [<product5>, <product6>]             |
      | 0    | 3          | [<product1>, <product2>, <product3>] |

  Scenario: getting a product
    Given <id> query, should return <product>
    When the user accesses the route "/products/<id>"
    Then should return a status code 200
    And should return a <product>

    Examples:
      | id | product    |
      | 1  | <product1> |
      | 2  | <product2> |
      | 3  | <product3> |

Feature: Updating the products
  Scenario: updating a product
    Given a valid <id> query, should return <message> and <status>
    When the user accesses the route "/products/<id>"
    Then should return a status code <status>
    And should return a <message>

    Examples:
      | id | message                                 | status |
      | 1  | { "message": "Product <code> updated" } | 204    |

  Scenario: updating a product with invalid id
    Given an invalid <id> query, should return <message> and <status>
    When the user accesses the route "/products/<id>"
    Then should return a status code <status>
    And should return a <message>

    Examples:
      | id | message                            | status |
      | 4  | { "message": "Product not found" } | 404    |

Feature: Deleting the products
  when it is requested to delete a product its status will be changed to "trash"

  Scenario: deleting a product
    Given a valid <id> query, should return <message> and <status>
    When the user accesses the route "/products/<id>"
    Then should return a status code <status>
    And should return a <message>

    Examples:
      | id | message                                 | status |
      | 1  | { "message": "Product <code> trashed" } | 204    |