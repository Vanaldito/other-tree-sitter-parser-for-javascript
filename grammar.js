module.exports = grammar({
  name: "javascript",

  word: ($) => $._identifier,

  extras: ($) => [$.comment, /[\s\p{Zs}\uFEFF\u2060\u200B]/],

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

    // Keywords
    import_keyword: ($) => "import",
    export_keyword: ($) => "export",
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
    instanceof_keyword: ($) => "instanceof",
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
    new_keyword: ($) => "new",
    try_keyword: ($) => "try",
    catch_keyword: ($) => "catch",
    finally_keyword: ($) => "finally",
    void_keyword: ($) => "void",
    typeof_keyword: ($) => "typeof",
    delete_keyword: ($) => "delete",
    debugger_keyword: ($) => "debugger",
    throw_keyword: ($) => "throw",

    // Import
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
    import_asterisk: ($) => "*",
    default_import: ($) => $.variable,
    import_entire_module: ($) =>
      seq($.import_asterisk, $.as_keyword, $.variable),
    normal_import: ($) =>
      seq("{", repeat(choice($.comma, $._ways_to_import_normally)), "}"),
    import_alias: ($) =>
      seq(choice($.default_keyword, $.variable), $.as_keyword, $.variable),
    _ways_to_import_normally: ($) => choice($.variable, $.import_alias),

    // Export
    export_statement: ($) => seq($.export_keyword, $._ways_to_export),
    _ways_to_export: ($) =>
      choice(
        $.normal_export,
        seq($.default_keyword, $._expression),
        $.export_entire_module,
        $.export_normally_from_module,
        $._all
      ),
    normal_export: ($) =>
      prec(
        2,
        seq(
          "{",
          repeat(prec(1, choice($._ways_to_export_normally, $.comma))),
          "}"
        )
      ),
    _ways_to_export_normally: ($) =>
      prec(1, choice($.variable, $.export_alias, $.default_keyword)),
    export_alias: ($) =>
      seq($.variable, $.as_keyword, choice($.default_keyword, $.variable)),
    export_asterisk: ($) => "*",
    export_entire_module: ($) =>
      seq(
        $.export_asterisk,
        optional(seq($.as_keyword, $.variable)),
        $.from_keyword,
        $.string
      ),
    export_normally_from_module: ($) =>
      seq($.normal_export, $.from_keyword, $.string),

    // String
    string: ($) => choice($._double_quote_string, $._single_quote_string),
    _double_quote_string: ($) =>
      seq('"', repeat($._double_quote_string_fragment), '"'),
    _single_quote_string: ($) =>
      seq("'", repeat($._single_quote_string_fragment), "'"),
    _double_quote_string_fragment: ($) =>
      choice(token.immediate(prec(1, /[^\\"]+/)), $._escaped_character),
    _single_quote_string_fragment: ($) =>
      choice(token.immediate(prec(1, /[^\\']+/)), $._escaped_character),

    // Template string
    template_string: ($) =>
      seq("`", repeat($._template_string_fragment), choice("$`", "`")),
    _template_string_fragment: ($) =>
      choice(
        token.immediate(prec(1, /[^\\`$]+/)),
        token.immediate(prec(1, /\$+[^\\`${]/)),
        $._escaped_character,
        seq("$", $._escaped_character),
        $.template_string_interpolation
      ),
    template_string_interpolation: ($) => seq("${", $._expression, "}"),

    // Variable
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
        seq($.variable, optional(seq(choice($.assignment_operator, $.colon), $._expression)))
      ),

    // Array
    array: ($) =>
      seq("[", repeat(prec(1, choice($._expression, $.comma))), "]"),

    // Objects
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

    // Operator and Operation
    unary_operator: ($) =>
      choice(
        $.delete_keyword,
        $.void_keyword,
        $.typeof_keyword,
        "+",
        "-",
        "~",
        "!"
      ),
    unary_operation: ($) => prec.left(1, seq($.unary_operator, $._expression)),
    arithmetic_operator: ($) => choice("+", "-", "/", "*", "%", "**"),
    arithmetic_operation: ($) =>
      prec.left(2, seq($._expression, $.arithmetic_operator, $._expression)),
    relational_operator: ($) =>
      choice($.in_keyword, $.instanceof_keyword, "<", ">", "<=", ">="),
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
        seq(
          choice($._ways_to_reassign_variable),
          $.reassignment_operator,
          $._expression
        )
      ),
    _ways_to_reassign_variable: ($) =>
      choice($._ways_to_assign_variable, $.property_accessor),
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
    spread_operator: ($) => "...",
    spread_operation: ($) => prec.left(seq($.spread_operator, $._expression)),
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
        $.ternary_operation,
        $.spread_operation
      ),
    assignment_operator: ($) => "=",

    // Conditional
    if_statement: ($) =>
      prec(1, seq(
        $.if_keyword,
        $.parenthized_expression,
        choice($._all, $.statement_block)
      )),
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

    // Loops
    while_statement: ($) =>
      prec(1, seq(
        $.while_keyword,
        $.parenthized_expression,
        choice($.statement_block, $._all)
      )),
    do_while_statement: ($) =>
      prec(1, seq(
        $.do_keyword,
        choice($.statement_block, $._all),
        $.while_keyword,
        $.parenthized_expression
      )),
    for_statement: ($) =>
      prec(1, seq(
        $.for_keyword,
        $.for_initialization,
        choice($._all, $.statement_block)
      )),
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
      seq(
        optional($.async_keyword),
        choice($.param, $.function_params),
        $.arrow_function_keyword,
        choice($.statement_block, $._expression_no_object)
      ),
    function_name: ($) => prec(1, $._identifier),
    function_params: ($) =>
      seq("(", repeat(choice($._ways_to_declare_param, $.comma)), ")"),
    param: ($) => $._identifier,
    param_with_default_value: ($) =>
      prec.left(seq($.param, $.assignment_operator, $._expression)),
    param_with_name_change: ($) =>
      prec.left(seq($.param, $.colon, $.param)),
    array_destructuring_param: ($) =>
      seq("[", repeat(choice($._ways_to_declare_param, $.comma)), "]"),
    object_destructuring_param: ($) =>
      seq("{", repeat(choice($._ways_to_declare_param, $.comma)), "}"),
    rest_param: ($) => seq($.spread_operator, $.param),
    _ways_to_declare_param: ($) =>
      choice(
        $.param,
        $.param_with_default_value,
        $.param_with_name_change,
        $.array_destructuring_param,
        $.object_destructuring_param,
        $.rest_param
      ),

    label: ($) => seq($.label_name, $.colon),
    label_name: ($) => prec(1, $._identifier),

    return_statement: ($) =>
      prec.right(seq($.return_keyword, optional($._expression))),
    yield_statement: ($) =>
      seq(
        $.yield_keyword,
        optional($.generator_asterisk_keyword),
        $._expression
      ),
    throw_statement: ($) => seq($.throw_keyword, $._expression),
    break_statement: ($) =>
      prec.right(seq($.break_keyword, optional($.label_name))),
    debugger_statement: ($) => $.debugger_keyword,
    continue_statement: ($) =>
      prec.right(seq($.continue_keyword, optional($.label_name))),
    await_expression: ($) => prec.right(seq($.await_keyword, $._expression)),

    // Clases
    class_declaration_statement: ($) =>
      seq(
        $.class_keyword,
        optional($.variable),
        optional(seq($.extends_keyword, $._expression)),
        $.class_block
      ),
    class_block: ($) =>
      seq(
        "{",
        repeat(choice($.method_definition, $.property_definition, $.semicolon)),
        "}"
      ),
    method_definition: ($) =>
      seq(
        optional(choice($.static_keyword, $.get_keyword, $.set_keyword)),
        optional($.async_keyword),
        optional($.generator_asterisk_keyword),
        $.function_name,
        $.function_params,
        $.statement_block
      ),
    property_definition: ($) =>
      seq(
        optional($.static_keyword),
        $.property_name,
        $.assignment_operator,
        $._expression
      ),
    new_instance_statement: ($) => prec.left(seq($.new_keyword, $._expression)),

    // Number
    _number: ($) => {
      const integer = /\d[0-9_]*/;
      const decimal = /(\d[0-9_]*)?\.\d[0-9_]*/;
      const exponential = seq(choice(integer, decimal), /e[+-]?\d[0-9_]*/);
      const binary = /0[bB][01][01_]*/;
      const octal = /0[oO][0-7][0-7_]*/;
      const hexadecimal = /0[xX][a-fA-F0-9][a-fA-F0-9_]*/;
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

    // Regex
    regex: ($) => seq("/", repeat($._regex_fragment), "/"),
    _regex_fragment: ($) =>
      choice(/[^/\\\[]+/, $._escaped_character, $._regex_group),
    _regex_group: ($) =>
      seq("[", repeat(choice(/[^\\\]]+/, $._escaped_character)), "]"),

    // Booelan and Primitive Value
    variable: ($) => $._identifier,
    boolean: ($) => choice("true", "false"),
    nan: ($) => "NaN",
    undefined: ($) => "undefined",
    null: ($) => "null",
    infinity: ($) => "Infinity",

    function_call: ($) =>
      prec(
        1,
        seq(
          choice($.function_name, $.parenthized_expression, $.function_call),
          $.function_call_params
        )
      ),
    function_call_params: ($) =>
      seq("(", repeat(prec.left(choice($._expression, $.comma))), ")"),

    // Try Catch
    try_statement: ($) => seq($.try_keyword, $.statement_block),
    catch_statement: ($) =>
      seq($.catch_keyword, optional($.function_params), $.statement_block),
    finally_statement: ($) => seq($.finally_keyword, $.statement_block),

    // Jsx
    jsx: ($) => choice($.jsx_self_closing_tag, $.jsx_tag, $.jsx_fragment),
    jsx_tag: ($) =>
      seq($.jsx_opening_tag, repeat($._jsx_children), $.jsx_closing_tag),
    jsx_fragment: ($) =>
      seq(
        $.jsx_opening_tag_sign,
        $.jsx_closing_tag_sign,
        repeat($._jsx_children),
        $.jsx_opening_tag_sign,
        $.jsx_slash,
        $.jsx_closing_tag_sign
      ),
    jsx_opening_tag: ($) =>
      seq(
        $.jsx_opening_tag_sign,
        $.jsx_tag_name,
        repeat($.jsx_tag_prop),
        $.jsx_closing_tag_sign
      ),
    jsx_closing_tag: ($) =>
      seq(
        $.jsx_opening_tag_sign,
        $.jsx_slash,
        $.jsx_tag_name,
        $.jsx_closing_tag_sign
      ),
    jsx_self_closing_tag: ($) =>
      seq(
        $.jsx_opening_tag_sign,
        $.jsx_tag_name,
        repeat($.jsx_tag_prop),
        $.jsx_slash,
        $.jsx_closing_tag_sign
      ),
    jsx_tag_prop: ($) =>
      choice($.shorthand_prop, $.key_value_prop, $.jsx_javascript_expression),
    shorthand_prop: ($) => $.jsx_prop_name,
    key_value_prop: ($) =>
      seq(
        $.jsx_prop_name,
        $.assignment_operator,
        choice($.string, $.jsx_javascript_expression)
      ),
    jsx_javascript_expression: ($) => seq("{", $._expression, "}"),
    jsx_tag_name: ($) => seq($._identifier, repeat(seq($.dot, $._identifier))),
    jsx_prop_name: ($) => $._identifier,
    _jsx_children: ($) =>
      choice(
        $.jsx_tag,
        $.jsx_self_closing_tag,
        $.jsx_javascript_expression,
        $.jsx_text,
        $.jsx_fragment
      ),
    jsx_text: ($) => token.immediate(prec(1, /[^<>{}]+/)),
    jsx_opening_tag_sign: ($) => "<",
    jsx_slash: ($) => "/",
    jsx_closing_tag_sign: ($) => ">",

    // Property Accesors
    property_accessor: ($) =>
      prec(
        1,
        seq(
          $._expression,
          choice($._bracket_notation_accessor, $._dot_notation_accessor)
        )
      ),
    _dot_notation_accessor: ($) =>
      seq(
        choice($.dot, $.optional_chaining),
        choice($.property_name, $.function_call)
      ),
    _bracket_notation_accessor: ($) => seq("[", $._expression, "]"),

    // Left Hand Side Expressions
    import_meta: ($) => seq($.import_keyword, $.dot, $.property_name), // import.meta
    new_target: ($) => seq($.new_keyword, $.dot, $.property_name), // new.target

    comment: ($) =>
      token(
        choice(
          seq("#!", /.*/),
          seq("//", /.*/),
          seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")
        )
      ),

    parenthized_expression: ($) => seq("(", $._expression, ")"),
    statement_block: ($) => prec(1, seq("{", repeat($._all), "}")),

    semicolon: ($) => ";",
    colon: ($) => ":",
    comma: ($) => ",",
    dot: ($) => ".",
    optional_chaining: ($) => "?.",

    _escaped_character: ($) => /\\.?/,
    _identifier: ($) => /[a-zA-Z$_#][a-zA-Z0-9$_]*/,

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
        $.import_meta,
        $.new_target,
        $.regex,
        $.jsx
      ),
    _expression: ($) => prec(-1, choice($._expression_no_object, $.object)),
    _all: ($) =>
      choice(
        $._expression,
        $.import_statement,
        $.export_statement,
        $.semicolon,
        $.variable_declaration_statement,
        $.if_statement,
        $.else_statement,
        $.switch_statement,
        $.while_statement,
        $.for_statement,
        $.return_statement,
        $.throw_statement,
        $.yield_statement,
        $.break_statement,
        $.continue_statement,
        $.try_statement,
        $.catch_statement,
        $.finally_statement,
        $.debugger_statement,
        $.label,
        $.statement_block,
      ),
  },
});
