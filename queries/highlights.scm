[
  (import_keyword)
  (export_keyword)
  (from_keyword)
  (as_keyword)
  (variable_declaration_keyword)
  (if_keyword)
  (else_keyword)
  (switch_keyword)
  (case_keyword)
  (default_keyword)
  (while_keyword)
  (do_keyword)
  (for_keyword)
  (instanceof_keyword)
  (in_keyword)
  (of_keyword)
  (await_keyword)
  (function_keyword)
  (arrow_function_keyword)
  (return_keyword)
  (yield_keyword)
  (generator_asterisk_keyword)
  (async_keyword)
  (continue_keyword)
  (break_keyword)
  (class_keyword)
  (extends_keyword)
  (static_keyword)
  (get_keyword)
  (set_keyword)
  (new_keyword)
  (try_keyword)
  (catch_keyword)
  (finally_keyword)
  (void_keyword)
  (typeof_keyword)
  (delete_keyword)
] @keyword
[(string) (template_string)] @string
(variable) @variable
[(export_asterisk) (import_asterisk)] @variable
(number) @number
(boolean) @boolean
[(nan) (null) (undefined)] @constant.builtin
(function_name) @function
(property_name) @property
(param) @parameter
[
  (unary_operator)
  (arithmetic_operator)
  (relational_operator)
  (equality_operator)
  (bitwise_shift_operator)
  (binary_bitwise_operator)
  (binary_logical_operator)
  (reassignment_operator)
  (increment_operator)
  (decrement_operator)
  (question_mark_operator)
  (colon_operator)
  (assignment_operator)
  (spread_operator)
] @operator
["(" ")" "${" "{" "}" "[" "]"] @punctuation.bracket
(comment) @comment
(regex) @string.regex
(label_name) @label
[(jsx_opening_tag_sign) (jsx_closing_tag_sign) (jsx_slash)] @tag.delimiter
(jsx_prop_name) @tag.attribute
(jsx_tag_name) @tag
(jsx_text) @none
