module.exports = grammar({
  name: "test",

  word: ($) => $._identifier,

  conflicts: ($) => [
    [$.object, $.object_destructuring_assignment],
    [$.object, $.object_destructuring_param],
    [$.object_destructuring_assignment, $.object_destructuring_param],
    [$.object, $.object_destructuring_assignment, $.object_destructuring_param],
    [$.array, $.array_destructuring_assignment],
    [$.array, $.array_destructuring_param],
    [$.array, $.array_destructuring_assignment, $.array_destructuring_param],
    [$.array, $.computed_key_value_property],
    [$.array, $.property_accessor],
    [$.assignment_operator, $.reassignment_operator],
    [$._expression_no_object, $._destructuring_element],
    [$.param, $.variable],
    [$._expression, $.property_name],
    [$.param, $.property_name],
    [$.variable, $.property_name],
    [$.number, $.property_name],
    [$.variable, $.property_name, $.param],
    [$._expression_no_object, $._ways_to_assign_variable],
  ],

  rules: {
    source_file: ($) => repeat($._all),

    import_keyword: ($) => "import",
    from_keyword: ($) => "from",
    as_keyword: ($) => "as",
    variable_declaration_keyword: ($) => choice("let", "var", "const"),
    if_keyword: ($) => "if",
    else_keyword: ($) => "else",
    switch_keyword: ($) => "switch",
    case_keyword: ($) => "case",
    default_keyword: ($) => "default",
    while_keyword: ($) => "while",
    do_keyword: ($) => "do",
    for_keyword: ($) => "for",
    in_keyword: ($) => "in",
    of_keyword: ($) => "of",
    await_keyword: ($) => "await",
    function_keyword: ($) => "function",
    arrow_function_keyword: ($) => "=>",
    return_keyword: ($) => "return",
    yield_keyword: ($) => "yield",
    generator_asterisk_keyword: ($) => "*",
    async_keyword: ($) => "async",
    continue_keyword: ($) => "continue",
    break_keyword: ($) => "break",
    class_keyword: ($) => "class",
    extends_keyword: ($) => "extends",
    static_keyword: ($) => "static",
    get_keyword: ($) => "get",
    set_keyword: ($) => "set",
    new_keyword: $ => "new",

    import_statement: ($) =>
      choice($._import_for_get_elements, $._import_for_side_effects),
    _import_for_get_elements: ($) =>
      seq(
        $.import_keyword,
        repeat(choice($.comma, $._ways_to_import)),
        $.from_keyword,
        $.string
      ),
    _import_for_side_effects: ($) => seq($.import_keyword, $.string),
    _ways_to_import: ($) =>
      choice($.default_import, $.import_entire_module, $.normal_import),
    import_element_name: ($) => $._identifier,
    import_asterisk: ($) => "*",
    default_import: ($) => $.import_element_name,
    import_entire_module: ($) =>
      seq($.import_asterisk, $.as_keyword, $.import_element_name),
    normal_import: ($) =>
      seq("{", repeat(choice($.comma, $._ways_to_import_normally)), "}"),
    import_alias: ($) =>
      seq($.import_element_name, $.as_keyword, $.import_element_name),
    _ways_to_import_normally: ($) =>
      choice($.import_element_name, $.import_alias),

    string: ($) => choice($._double_quote_string, $._single_quote_string),
    _double_quote_string: ($) =>
      seq('"', repeat($._double_quote_string_fragment), '"'),
    _single_quote_string: ($) =>
      seq("'", repeat($._single_quote_string_fragment), "'"),

    template_string: ($) =>
      seq("`", repeat($._template_string_fragment), choice("$`", "`")),
    _template_string_fragment: ($) =>
      choice(
        $._escaped_character,
        seq("$", $._escaped_character),
        $.template_string_interpolation
      ),
    template_string_interpolation: ($) => seq("${", $._expression, "}"),

    variable_declaration_statement: ($) =>
      seq(
        $.variable_declaration_keyword,
        $._declare_variable,
        repeat(seq($.comma, $._declare_variable))
      ),
    _declare_variable: ($) =>
      prec.left(
        seq(
          $._ways_to_assign_variable,
          optional(seq($.assignment_operator, $._expression))
        )
      ),
    _ways_to_assign_variable: ($) =>
      prec.left(
        choice(
          $.variable,
          $.array_destructuring_assignment,
          $.object_destructuring_assignment
        )
      ),
    array_destructuring_assignment: ($) =>
      seq("[", repeat(choice($.comma, $._destructuring_element)), "]"),
    object_destructuring_assignment: ($) =>
      seq("{", repeat(choice($.comma, $._destructuring_element)), "}"),
    _destructuring_element: ($) =>
      prec.left(
        seq($.variable, optional(seq($.assignment_operator, $._expression)))
      ),

    array: ($) =>
      seq("[", repeat(prec(1, choice($._expression, $.comma))), "]"),

    object: ($) =>
      seq(
        "{",
        repeat(
          choice(
            $.shorthand_property,
            $.key_value_property,
            $.string_key_value_property,
            $.computed_key_value_property,
            $.comma
          )
        ),
        "}"
      ),
    shorthand_property: ($) => $.property_name,
    key_value_property: ($) =>
      prec.left(seq(choice($.property_name), $.colon, $._expression)),
    string_key_value_property: ($) =>
      prec.left(seq($.string, $.colon, $._expression)),
    computed_key_value_property: ($) =>
      prec.left(seq("[", $._expression, "]", $.colon, $._expression)),
    property_name: ($) => choice($._identifier, $._number),

    unary_operator: ($) =>
      choice("delete", "void", "typeof", "+", "-", "~", "!"),
    unary_operation: ($) => prec.left(1, seq($.unary_operator, $._expression)),
    arithmetic_operator: ($) => choice("+", "-", "/", "*", "%", "**"),
    arithmetic_operation: ($) =>
      prec.left(2, seq($._expression, $.arithmetic_operator, $._expression)),
    relational_operator: ($) =>
      choice("in", "instanceof", "<", ">", "<=", ">="),
    relational_operation: ($) =>
      prec.left(2, seq($._expression, $.relational_operator, $._expression)),
    equality_operator: ($) => choice("==", "!=", "===", "!=="),
    equality_operation: ($) =>
      prec.left(2, seq($._expression, $.equality_operator, $._expression)),
    bitwise_shift_operator: ($) => choice("<<", ">>", ">>>"),
    bitwise_shift_operation: ($) =>
      prec.left(2, seq($._expression, $.bitwise_shift_operator, $._expression)),
    binary_bitwise_operator: ($) => choice("&", "|", "^"),
    binary_bitwise_operation: ($) =>
      prec.left(
        2,
        seq($._expression, $.binary_bitwise_operator, $._expression)
      ),
    binary_logical_operator: ($) => choice("&&", "||", "??"),
    binary_logical_operation: ($) =>
      prec.left(
        2,
        seq($._expression, $.binary_logical_operator, $._expression)
      ),
    reassignment_operator: ($) =>
      choice(
        "=",
        "*=",
        "**=",
        "/=",
        "%=",
        "+=",
        "-=",
        "<<=",
        ">>=",
        ">>>=",
        "&=",
        "^=",
        "|=",
        "&&=",
        "||=",
        "??="
      ),
    reassignment_operation: ($) =>
      prec.right(
        seq(choice($._ways_to_reassign_variable), $.reassignment_operator, $._expression)
      ),
    _ways_to_reassign_variable: $ => choice($._ways_to_assign_variable, $.property_accessor),
    comma_operation: ($) =>
      prec.left(seq($._expression, $.comma, $._expression)),
    increment_operator: ($) => "++",
    increment_operation: ($) =>
      prec.left(
        2,
        choice(
          seq($.increment_operator, $._expression),
          seq($._expression, $.increment_operator)
        )
      ),
    decrement_operator: ($) => "--",
    decrement_operation: ($) =>
      prec.left(
        2,
        choice(
          seq($.decrement_operator, $._expression),
          seq($._expression, $.decrement_operator)
        )
      ),
    question_mark_operator: ($) => "?",
    colon_operator: ($) => ":",
    ternary_operation: ($) =>
      prec.right(
        2,
        seq(
          $._expression,
          $.question_mark_operator,
          $._expression,
          $.colon_operator,
          $._expression
        )
      ),
    _operation: ($) =>
      choice(
        $.unary_operation,
        $.arithmetic_operation,
        $.relational_operation,
        $.equality_operation,
        $.bitwise_shift_operation,
        $.binary_bitwise_operation,
        $.binary_logical_operation,
        $.reassignment_operation,
        $.comma_operation,
        $.increment_operation,
        $.decrement_operation,
        $.ternary_operation
      ),
    assignment_operator: ($) => "=",

    if_statement: ($) =>
      seq(
        $.if_keyword,
        $.parenthized_expression,
        choice($._all, $.statement_block)
      ),
    else_statement: ($) =>
      prec(
        1,
        seq($.else_keyword, choice($.if_statement, $._all, $.statement_block))
      ),
    switch_statement: ($) =>
      seq($.switch_keyword, $.parenthized_expression, $.switch_block),
    switch_block: ($) =>
      seq("{", repeat(choice($.switch_case, $.switch_default)), "}"),
    switch_case: ($) =>
      seq($.case_keyword, $._expression, $.colon, repeat($._all)),
    switch_default: ($) => seq($.default_keyword, $.colon, repeat($._all)),

    while_statement: ($) =>
      seq(
        $.while_keyword,
        $.parenthized_expression,
        choice($.statement_block, $._all)
      ),
    do_while_statement: ($) =>
      seq(
        $.do_keyword,
        choice($.statement_block, $._all),
        $.while_keyword,
        $.parenthized_expression
      ),
    for_statement: ($) =>
      seq(
        $.for_keyword,
        $.for_initialization,
        choice($._all, $.statement_block)
      ),
    for_initialization: ($) =>
      seq(
        optional($.await_keyword),
        "(",
        choice(repeat($._all), $.in_of_variable_declaration),
        ")"
      ),
    in_of_variable_declaration: ($) =>
      seq(
        optional($.variable_declaration_keyword),
        $._ways_to_assign_variable,
        choice($.in_keyword, $.of_keyword),
        $._expression
      ),

    traditional_function_declaration_statement: ($) =>
      seq(
        optional($.async_keyword),
        $.function_keyword,
        optional($.generator_asterisk_keyword),
        optional($.function_name),
        $.function_params,
        $.statement_block
      ),
    arrow_function_declaration_statement: ($) =>
      prec.right(
        seq(
          optional($.async_keyword),
          choice($.param, $.function_params),
          $.arrow_function_keyword,
          choice($.statement_block, $._expression_no_object)
        )
      ),
    function_name: ($) => prec(1, $._identifier),
    function_params: ($) =>
      seq("(", repeat(choice($._ways_to_declare_param, $.comma)), ")"),
    param: ($) => $._identifier,
    param_with_default_value: ($) =>
      prec.left(seq($.param, $.assignment_operator, $._expression)),
    array_destructuring_param: ($) =>
      seq("[", repeat(choice($._ways_to_declare_param, $.comma)), "]"),
    object_destructuring_param: ($) =>
      seq("{", repeat(choice($._ways_to_declare_param, $.comma)), "}"),
    _ways_to_declare_param: ($) =>
      choice(
        $.param,
        $.param_with_default_value,
        $.array_destructuring_param,
        $.object_destructuring_param
      ),

    return_statement: ($) => seq($.return_keyword, $._expression),
    yield_statement: ($) => seq($.yield_keyword, $._expression),
    break_statement: ($) => $.break_keyword,
    continue_statement: ($) => $.continue_keyword,
    await_expression: ($) => prec.right(seq($.await_keyword, $._expression)),

    class_declaration_statement: ($) =>
      seq(
        $.class_keyword,
        optional($.variable),
        optional(seq($.extends_keyword, $._expression)),
        $.class_block
      ),
    class_block: ($) => seq("{", repeat(choice($.method_definition, $.property_definition, $.semicolon)), "}"),
    method_definition: ($) =>
      seq(
        optional(choice($.static_keyword, $.get_keyword, $.set_keyword)),
        optional($.async_keyword),
        optional($.generator_asterisk_keyword),
        $.function_name,
        $.function_params,
        $.statement_block,
      ),
    property_definition: ($) => seq(optional($.static_keyword), $.property_name, $.assignment_operator, $._expression),
    new_instance_statement: $ => prec.left(seq($.new_keyword, $._expression)),

    _number: ($) => {
      const bigint = seq(
        choice(integer, decimal, exponential, binary, octal, hexadecimal),
        "n"
      );

      return token(
        choice(
          integer,
          decimal,
          exponential,
          binary,
          octal,
          hexadecimal,
          bigint
        )
      );
    },
    number: ($) => $._number,

    variable: ($) => $._identifier,
    boolean: ($) => choice("true", "false"),
    nan: ($) => "NaN",
    undefined: ($) => "undefined",
    null: ($) => "null",
    infinity: ($) => "Infinity",

    function_call: $ => prec(1, seq(choice($.function_name, $.parenthized_expression, $.function_call), $.function_call_params)),
    function_call_params: $ => seq("(", repeat(prec.left(choice($._expression, $.comma))), ")"),

    property_accessor: $ => prec(1, seq($._expression, choice($._bracket_notation_accessor, $._dot_notation_accessor))),
    _dot_notation_accessor: $ => seq(choice($.dot, $.optional_chaining), choice($.property_name, $.function_call)),
    _bracket_notation_accessor: $ => seq("[", $._expression, "]"),

    parenthized_expression: ($) => seq("(", $._expression, ")"),
    statement_block: ($) => prec(1, seq("{", repeat($._all), "}")),

    semicolon: ($) => ";",
    colon: ($) => ":",
    comma: ($) => ",",
    dot: $ => ".",
    optional_chaining: $ => "?.",

    _expression_no_object: ($) =>
      choice(
        $._operation,
        $.variable,
        $.number,
        $.string,
        $.template_string,
        $.infinity,
        $.boolean,
        $.nan,
        $.undefined,
        $.null,
        $.parenthized_expression,
        $.array,
        $.traditional_function_declaration_statement,
        $.arrow_function_declaration_statement,
        $.await_expression,
        $.class_declaration_statement,
        $.new_instance_statement,
        $.function_call,
        $.property_accessor,
      ),
    _expression: ($) => prec(1, choice($._expression_no_object, $.object)),
    _all: ($) =>
      choice(
        $._expression,
        $.import_statement,
        $.semicolon,
        $.variable_declaration_statement,
        $.if_statement,
        $.else_statement,
        $.switch_statement,
        $.while_statement,
        $.for_statement,
        $.return_statement,
        $.yield_statement,
        $.break_statement,
        $.continue_statement
      ),
  },
});
