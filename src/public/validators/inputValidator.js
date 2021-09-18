// console.log([document.querySelector('.form-group')])
function Validator(options) {
  var selectorRules = {}

  function validate(inputElement, rule) {
    var errorMessage
    // span hiển thị lỗi
    var errorElement = inputElement.parentElement.querySelector(
      options.errorSelector,
    )
    var rules = selectorRules[rule.selector]
    // console.log(rules)

    for (let i in rules) {
      errorMessage = rules[i](inputElement.value)
      if (errorMessage) break
    }
    if (errorMessage) {
      errorElement.innerText = errorMessage
      const inputField =
        inputElement.parentElement.querySelector('input') ||
        inputElement.parentElement.querySelector('textarea')
      inputField.classList.add('is-invalid')
      // console.log(inputElement.closest('div').querySelector('input'))
    } else {
      errorElement.innerText = ''
      inputElement.classList.remove('is-invalid')
    }
  }
  var formElement = document.querySelector(options.form)
  // console.log(formElement)
  if (formElement) {
    options.rules.forEach(function (rule) {
      if (!Array.isArray(selectorRules[rule.selector]))
        selectorRules[rule.selector] = [rule.test]
      // console.log(rule.test)
      else selectorRules[rule.selector].push(rule.test)

      var inputElement = formElement.querySelector(rule.selector)
      if (inputElement) {
        // xử lý không nhập
        inputElement.onblur = function () {
          console.log(inputElement)
          validate(inputElement, rule)
        }

        // xử lý nhập lại
        inputElement.oninput = function () {
          var errorElement = inputElement.parentElement.querySelector(
            options.errorSelector,
          )
          errorElement.innerText = ''
          inputElement.parentElement.classList.remove('is-invalid')
        }
      }
    })
  }
}

Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : message || 'Dữ liệu không hợp lệ'
    },
  }
}

Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      if (
        value.match(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        )
      ) {
        return undefined
      }
      return message || 'Dữ liệu không hợp lệ'
    },
  }
}

Validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim().length >= min
        ? undefined
        : message || 'Dữ liệu không hợp lệ'
    },
  }
}

Validator.confirmPassword = function (
  selector,
  confirmPasswordFunction,
  message,
) {
  return {
    selector: selector,
    test: function (value) {
      console.log(value)
      console.log(confirmPasswordFunction())
      return value === confirmPasswordFunction()
        ? undefined
        : message || 'Dữ liệu không hợp lệ'
    },
  }
}
