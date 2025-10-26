export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  baseXP: number;
  baselineTime: number; // in minutes
  language: 'python' | 'javascript' | 'cpp' | 'java' ;
  category: string;
  isLocked: boolean;
  prerequisite?: string;
  content: {
    steps: Array<{
      title: string;
      content: string;
      code: string;
      explanation: string;
      type: 'theory';
    } | {
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
      type: 'question';
    }>;
  };
}

export const calculateXP = (
  xp: number,
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
  lessonIndex: number,
  totalLessons: number,
  actualTime: number, // in minutes
  baselineTime: number // in minutes
): number => {
  const difficultyMultiplier = {
    'Beginner': 1,
    'Intermediate': 1.5,
    'Advanced': 2
  }[difficulty];

  const maxMultiplier = 0.5; // 50% increase for later lessons
  const progressMultiplier = 1 + (lessonIndex / totalLessons) * maxMultiplier;

  const timeMultiplier = 0.2; // Up to 20% bonus for speed
  const timeBonus = Math.max(0, ((baselineTime - actualTime) / baselineTime) * timeMultiplier);

  const finalXP = xp * difficultyMultiplier * progressMultiplier * (1 + timeBonus);
  return Math.round(finalXP);
};

// Helper function to get difficulty based on lesson index
export const getDifficultyByIndex = (index: number): 'Beginner' | 'Intermediate' | 'Advanced' => {
  if (index < 17) return 'Beginner';
  if (index < 34) return 'Intermediate';
  return 'Advanced';
};

export const pythonLessons: Lesson[] = [
  {
    id: 'python-syntax',
    title: 'Python Syntax',
    description: 'Learn the rules of Python syntax, including indentation, printing, and basic statements.',
    difficulty: 'Beginner',
    baseXP: 50,
    baselineTime: 1,
    language: 'python',
    category: 'Fundamentals',
    isLocked: false,
    content: {
      steps: [
        {
          title: 'Printing in Python',
          content: 'Python uses the print() function to display output to the console.',
          code: `print("Hello, World!")`,
          explanation: 'The print() function outputs the string or value passed to it.',
          type: 'theory'
        },
        {
          title: 'Indentation',
          content: 'Python uses indentation to define code blocks instead of braces.',
          code: `if 5 > 2:
    print("5 is greater than 2")`,
          explanation: 'The indented block under if is executed only when the condition is True.',
          type: 'theory'
        },
        {
          title: 'Multiple Statements in One Line',
          content: 'You can write multiple statements on a single line separated by semicolons.',
          code: `a = 5; b = 10; print(a + b)`,
          explanation: 'All statements are executed sequentially, separated by semicolons.',
          type: 'theory'
        },
        {
          title: 'Comments',
          content: 'Comments explain the code and are ignored during execution.',
          code: `# This is a comment
print("Python Syntax Example")`,
          explanation: 'Any text after # on a line is a comment and does not run.',
          type: 'theory'
        },
        {
          question: 'What will this code print?\n\nx = 10\ny = 5\nprint(x - y)',
          options: ['5', '15', '-5', '105'],
          correctAnswer: 0,
          explanation: '10 - 5 equals 5, so the output is 5.',
          type: 'question'
        },
        {
          question: 'Which of these is the correct way to write a comment in Python?',
          options: [
            '// This is a comment',
            '<!-- This is a comment -->',
            '# This is a comment',
            '/* This is a comment */'
          ],
          correctAnswer: 2,
          explanation: 'Python uses "#" to start single-line comments.',
          type: 'question'
        }
      ]
    }
  },
  {
    id: 'python-comments',
    title: 'Python Comments',
    description: 'Learn how to write single-line and multi-line comments in Python.',
    difficulty: 'Beginner',
    baseXP: 55,
    baselineTime: 1,
    language: 'python',
    category: 'Fundamentals',
    isLocked: false,
    content: {
      steps: [
        {
          title: 'Single-line Comment',
          content: 'Use # to write a single-line comment in Python.',
          code: `# This prints a message
print("Hello!")`,
          explanation: 'The line starting with # is ignored by Python.',
          type: 'theory'
        },
        {
          title: 'Multi-line Comment',
          content: 'Use triple quotes """ """ to write multi-line comments.',
          code: `"""
This is a multi-line comment
spanning multiple lines
"""
print("Python Comments Example")`,
          explanation: 'Python ignores text inside triple quotes if not assigned to a variable.',
          type: 'theory'
        },
        {
          title: 'Inline Comment',
          content: 'Comments can also be added after a statement on the same line.',
          code: `x = 5  # Assigning value 5 to x`,
          explanation: 'Python ignores everything after # on the same line.',
          type: 'theory'
        },
        {
          title: 'Commenting for Debugging',
          content: 'You can temporarily disable code by turning it into a comment.',
          code: `# print("This line is ignored")
print("Only this line runs")`,
          explanation: 'Commenting code is useful for debugging or explanations.',
          type: 'theory'
        },
        {
          question: 'Add a comment explaining what this line does:\n\n y = 10 * 2',
          options: [
            '# Multiplies 10 by 2',
            '// Multiplies 10 by 2',
            '/* Multiplies 10 by 2 */',
            '<!-- Multiplies 10 by 2 -->'
          ],
          correctAnswer: 0,
          explanation: 'Python uses # to add single-line comments.',
          type: 'question'
        },
        {
          question: 'Which syntax is used for multi-line comments in Python?',
          options: [
            '// comment',
            '""" comment """',
            '<!-- comment -->',
            '# comment'
          ],
          correctAnswer: 1,
          explanation: 'Triple quotes """ """ can be used for multi-line comments in Python.',
          type: 'question'
        }
      ]
    }
  },
  {
    id: 'python-variables',
    title: 'Python Variables',
    description: 'Learn how to create, assign, and use variables in Python.',
    difficulty: 'Beginner',
    baseXP: 60,
    baselineTime: 1,
    language: 'python',
    category: 'Fundamentals',
    isLocked: false,
    content: {
      steps: [
        {
          title: 'Creating Variables',
          content: 'Variables are created by assigning a value using the = operator.',
          code: `x = 10
name = "Jason"`,
          explanation: 'The variable x holds an integer, and name holds a string.',
          type: 'theory'
        },
        {
          title: 'Variable Naming Rules',
          content: 'Variable names must start with a letter or underscore, and cannot be keywords.',
          code: `_age = 25
firstName = "Bob"`,
          explanation: 'Valid variable names can include letters, numbers (not at the start), and underscores.',
          type: 'theory'
        },
        {
          title: 'Multiple Assignments',
          content: 'You can assign multiple variables in a single line.',
          code: `a, b, c = 1, 2, 3`,
          explanation: 'a gets 1, b gets 2, c gets 3 in one statement.',
          type: 'theory'
        },
        {
          title: 'Updating Variables',
          content: 'You can update the value of a variable by reassigning it.',
          code: `x = 5
x = x + 2  # x is now 7`,
          explanation: 'Variables are dynamic and can store different values over time.',
          type: 'theory'
        },
        {
          question: 'Which of the following is a valid Python variable name?',
          options: ['2name', '_name', 'my-name', 'class'],
          correctAnswer: 1,
          explanation: 'Variable names cannot start with a number and cannot contain hyphens; _name is valid.',
          type: 'question'
        },
        {
          question: 'What will this code print?\n\nx = 5\nx = x + 10\nprint(x)',
          options: ['5', '10', '15', 'Error'],
          correctAnswer: 2,
          explanation: 'x is updated from 5 to 15 by adding 10.',
          type: 'question'
        }
      ]
    }
  },

  // ------------------- Python Data Types -------------------
  {
    id: 'python-data-types',
    title: 'Python Data Types',
    description: 'Learn about different data types in Python, such as integers, floats, strings, and booleans.',
    difficulty: 'Beginner',
    baseXP: 65,
    baselineTime: 1,
    language: 'python',
    category: 'Fundamentals',
    isLocked: false,
    content: {
      steps: [
        {
          title: 'Numeric Types',
          content: 'Python has int and float types to represent numbers.',
          code: `x = 10      # int
y = 3.14    # float`,
          explanation: 'Integers are whole numbers, floats are decimal numbers.',
          type: 'theory'
        },
        {
          title: 'String Type',
          content: 'Strings are sequences of characters enclosed in quotes.',
          code: `name = "Jason"
greeting = 'Hello'`,
          explanation: 'Strings can be created using single or double quotes.',
          type: 'theory'
        },
        {
          title: 'Boolean Type',
          content: 'Booleans represent True or False values.',
          code: `is_active = True
is_admin = False`,
          explanation: 'Booleans are commonly used in conditional statements.',
          type: 'theory'
        },
        {
          title: 'Type Function',
          content: 'The type() function shows the data type of a variable.',
          code: `x = 10
print(type(x))  # <class 'int'>`,
          explanation: 'type() helps to check what type of data a variable holds.',
          type: 'theory'
        },
        {
          question: 'What type of variable is x?\n\nx = 5.5',
          options: ['int', 'float', 'str', 'bool'],
          correctAnswer: 1,
          explanation: '5.5 is a float because it has a decimal point.',
          type: 'question'
        },
        {
          question: 'Which of these values is a Boolean?',
          options: ['"True"', 'true', 'False', '1'],
          correctAnswer: 2,
          explanation: 'False (without quotes) is a Boolean in Python.',
          type: 'question'
        }
      ]
    }
  },

  // ------------------- Python Numbers -------------------
  {
    id: 'python-numbers',
    title: 'Python Numbers',
    description: 'Learn how to use numbers in Python and perform arithmetic operations.',
    difficulty: 'Beginner',
    baseXP: 70,
    baselineTime: 1,
    language: 'python',
    category: 'Fundamentals',
    isLocked: false,
    content: {
      steps: [
        {
          title: 'Basic Arithmetic',
          content: 'Python supports addition, subtraction, multiplication, and division.',
          code: `x = 10
y = 3
print(x + y)  # 13
print(x - y)  # 7
print(x * y)  # 30
print(x / y)  # 3.3333...`,
          explanation: 'Python performs standard arithmetic operations on numbers.',
          type: 'theory'
        },
        {
          title: 'Floor Division and Modulus',
          content: 'Floor division // returns the integer part, % gives the remainder.',
          code: `print(10 // 3)  # 3
print(10 % 3)   # 1`,
          explanation: '// divides and returns the integer part, % returns remainder.',
          type: 'theory'
        },
        {
          title: 'Exponentiation',
          content: 'Use ** to raise a number to a power.',
          code: `print(2 ** 3)  # 8`,
          explanation: '** performs exponentiation in Python.',
          type: 'theory'
        },
        {
          title: 'Type Conversion',
          content: 'You can convert numbers between int and float using int() and float().',
          code: `x = 5
y = float(x)  # 5.0
z = int(y)    # 5`,
          explanation: 'Casting allows changing the type of a numeric variable.',
          type: 'theory'
        },
        {
          question: 'What will print?\n\nprint(7 % 3)',
          options: ['1', '2', '3', '0'],
          correctAnswer: 1,
          explanation: '7 divided by 3 gives remainder 1, so 7 % 3 = 1.',
          type: 'question'
        },
        {
          question: 'Which operator is used for exponentiation in Python?',
          options: ['^', '**', 'exp()', '%'],
          correctAnswer: 1,
          explanation: 'Python uses ** to raise a number to a power.',
          type: 'question'
        }
      ]
    }
  },
  // ------------------- Python Casting -------------------
  {
    id: 'python-casting',
    title: 'Python Casting',
    description: 'Learn how to convert one data type into another using casting functions in Python.',
    difficulty: 'Beginner',
    baseXP: 75,
    baselineTime: 1,
    language: 'python',
    category: 'Fundamentals',
    isLocked: false,
    content: {
      steps: [
        {
          title: 'Casting to int',
          content: 'Use int() to convert a number or string to an integer.',
          code: `x = int(3.7)     # 3
y = int("10")    # 10`,
          explanation: 'int() removes the decimal part or converts a numeric string to integer.',
          type: 'theory'
        },
        {
          title: 'Casting to float',
          content: 'Use float() to convert an integer or string to a floating-point number.',
          code: `x = float(5)       # 5.0
y = float("3.14")  # 3.14`,
          explanation: 'float() creates a number with decimals from integers or numeric strings.',
          type: 'theory'
        },
        {
          title: 'Casting to string',
          content: 'Use str() to convert a number or boolean to a string.',
          code: `x = str(10)    # "10"
y = str(True)   # "True"`,
          explanation: 'str() converts any data type into a string.',
          type: 'theory'
        },
        {
          title: 'Mixing types in operations',
          content: 'Casting allows combining different types safely.',
          code: `x = "5"
y = 3
result = int(x) + y
print(result)  # 8`,
          explanation: 'You need to cast the string "5" to int before adding to 3.',
          type: 'theory'
        },
        {
          question: 'What will this code print?\n\nx = float(7)\nprint(x)',
          options: ['7', '7.0', '7.00', 'Error'],
          correctAnswer: 1,
          explanation: 'Casting 7 to float gives 7.0.',
          type: 'question'
        },
        {
          question: 'Which function converts a number to a string?',
          options: ['int()', 'str()', 'float()', 'bool()'],
          correctAnswer: 1,
          explanation: 'str() converts a number or other data type to a string.',
          type: 'question'
        }
      ]
    }
  },

  // ------------------- Python Strings -------------------
  {
    id: '1python-strings',
    title: 'Python Strings',
    description: 'Learn how to create and manipulate text data using strings in Python.',
    difficulty: 'Beginner',
    baseXP: 80,
    baselineTime: 1,
    language: 'python',
    category: 'Fundamentals',
    isLocked: false,
    content: {
      steps: [
        {
          title: 'Creating Strings',
          content: 'Strings can be created using single or double quotes.',
          code: `name = "Jason"
greeting = 'Hello'`,
          explanation: 'Both single and double quotes are valid for string literals.',
          type: 'theory'
        },
        {
          title: 'String Concatenation',
          content: 'Combine strings using the + operator.',
          code: `first = "Hello"
second = "World"
message = first + " " + second
print(message)  # "Hello World"`,
          explanation: 'The + operator merges strings together.',
          type: 'theory'
        },
        {
          title: 'String Repetition',
          content: 'Use * to repeat a string multiple times.',
          code: `text = "Hi! "
print(text * 3)  # "Hi! Hi! Hi! "`,
          explanation: 'Multiplying a string repeats it.',
          type: 'theory'
        },
        {
          title: 'Accessing Characters',
          content: 'Use indexing to access individual characters in a string.',
          code: `word = "Python"
print(word[0])  # "P"
print(word[3])  # "h"`,
          explanation: 'String indices start at 0; you can access any character by its position.',
          type: 'theory'
        },
        {
          question: 'What will this print?\n\ntext = "Python"\nprint(text[2])',
          options: ['y', 't', 'h', 'o'],
          correctAnswer: 1,
          explanation: 'Index 2 of "Python" is "t".',
          type: 'question'
        },
        {
          question: 'Which operator is used to join strings?',
          options: ['+', '-', '*', '/'],
          correctAnswer: 0,
          explanation: 'The + operator concatenates strings.',
          type: 'question'
        }
      ]
    }
  },

  // ------------------- Python Booleans -------------------
  {
    id: 'python-booleans',
    title: 'Python Booleans',
    description: 'Learn how to work with Boolean values True and False in Python.',
    difficulty: 'Beginner',
    baseXP: 85,
    baselineTime: 1,
    language: 'python',
    category: 'Fundamentals',
    isLocked: false,
    content: {
      steps: [
        {
          title: 'Boolean Values',
          content: 'Booleans represent True or False values.',
          code: `is_active = True
is_admin = False`,
          explanation: 'Booleans are commonly used to represent conditions.',
          type: 'theory'
        },
        {
          title: 'Comparisons',
          content: 'Comparison operators return Boolean results.',
          code: `x = 5
y = 3
print(x > y)   # True
print(x == y)  # False`,
          explanation: 'Operators like >, <, == return True or False depending on the comparison.',
          type: 'theory'
        },
        {
          title: 'Logical Operators',
          content: 'Use and, or, not to combine or invert Boolean values.',
          code: `a = True
b = False
print(a and b)  # False
print(a or b)   # True
print(not a)    # False`,
          explanation: 'Logical operators help combine multiple conditions.',
          type: 'theory'
        },
        {
          title: 'Booleans in If Statements',
          content: 'Booleans control the flow of if statements.',
          code: `is_raining = True
if is_raining:
    print("Take an umbrella!")`,
          explanation: 'The block inside if runs only if the condition is True.',
          type: 'theory'
        },
        {
          question: 'What will this print?\n\nx = 10\ny = 10\nprint(x != y)',
          options: ['True', 'False', '10', 'Error'],
          correctAnswer: 1,
          explanation: 'x != y checks if x is not equal to y. 10 != 10 is False.',
          type: 'question'
        },
        {
          question: 'Which of these is a Boolean value?',
          options: ['"False"', 'False', '0', 'None'],
          correctAnswer: 1,
          explanation: 'False without quotes is a Boolean in Python.',
          type: 'question'
        }
      ]
    }
  },
  // ------------------- Python Sets -------------------
{
  id: 'python-sets',
  title: 'Python Sets',
  description: 'Learn how to store unique items in an unordered collection using sets.',
  difficulty: 'Beginner',
  baseXP: 90,
  baselineTime: 1,
  language: 'python',
  category: 'Fundamentals',
  isLocked: false,
  content: {
    steps: [
      {
        title: 'Creating a Set',
        content: 'Sets store unique elements in curly braces {} or using the set() function.',
        code: `fruits = {"apple", "banana", "cherry"}
numbers = set([1, 2, 2, 3])  # duplicates removed
print(numbers)  # {1, 2, 3}`,
        explanation: 'Sets automatically remove duplicates and have no specific order.',
        type: 'theory'
      },
      {
        title: 'Adding Items',
        content: 'Add items to a set using add() or update().',
        code: `fruits = {"apple", "banana"}
fruits.add("cherry")
fruits.update(["orange", "kiwi"])
print(fruits)`,
        explanation: 'add() adds a single element, update() can add multiple.',
        type: 'theory'
      },
      {
        title: 'Removing Items',
        content: 'Remove items using remove(), discard(), or pop().',
        code: `fruits = {"apple", "banana", "cherry"}
fruits.remove("banana")  # removes element
print(fruits)`,
        explanation: 'remove() raises an error if the item doesn’t exist, discard() does not.',
        type: 'theory'
      },
      {
        title: 'Set Operations',
        content: 'Perform union, intersection, difference, and symmetric difference.',
        code: `a = {1, 2, 3}
b = {3, 4, 5}
print(a | b)  # Union {1, 2, 3, 4, 5}
print(a & b)  # Intersection {3}
print(a - b)  # Difference {1, 2}`,
        explanation: 'Sets support mathematical operations for combining and comparing.',
        type: 'theory'
      },
      {
        question: 'Which of these statements is True?\n\nfruits = {"apple", "banana"}\nfruits.add("apple")',
        options: ['"apple" is added again', 'No change, duplicates not allowed', 'Error', 'Set becomes a list'],
        correctAnswer: 1,
        explanation: 'Sets do not allow duplicates, so adding an existing element has no effect.',
        type: 'question'
      },
      {
        question: 'What will this print?\n\na = {1, 2}\nb = {2, 3}\nprint(a & b)',
        options: ['{1, 2, 3}', '{1, 2}', '{2}', '{3}'],
        correctAnswer: 2,
        explanation: 'The & operator gives the intersection of sets.',
        type: 'question'
      }
    ]
  }
},

// ------------------- Python Dictionaries -------------------
{
  id: 'python-dictionaries',
  title: 'Python Dictionaries',
  description: 'Learn how to store key-value pairs using dictionaries in Python.',
  difficulty: 'Beginner',
  baseXP: 95,
  baselineTime: 1,
  language: 'python',
  category: 'Fundamentals',
  isLocked: false,
  content: {
    steps: [
      {
        title: 'Creating a Dictionary',
        content: 'Dictionaries store data in key-value pairs using curly braces {}.',
        code: `person = {"name": "Jason", "age": 25, "city": "Paris"}`,
        explanation: 'Each key must be unique, and values can be any type.',
        type: 'theory'
      },
      {
        title: 'Accessing Values',
        content: 'Access dictionary values using keys.',
        code: `person = {"name": "Jason", "age": 25}
print(person["name"])  # Jason
print(person.get("age"))  # 25`,
        explanation: 'Use dict[key] or dict.get(key) to access values.',
        type: 'theory'
      },
      {
        title: 'Adding/Modifying Items',
        content: 'Add or update items using assignment.',
        code: `person = {"name": "Jason"}
person["age"] = 25  # Add new key-value pair
person["name"] = "Bob"  # Modify existing value
print(person)  # {"name": "Bob", "age": 25}`,
        explanation: 'Dictionaries are mutable, so you can add or update items easily.',
        type: 'theory'
      },
      {
        title: 'Removing Items',
        content: 'Use pop(), del, or clear() to remove dictionary items.',
        code: `person = {"name": "Jason", "age": 25}
person.pop("age")  # removes age
print(person)
del person["name"]
print(person)`,
        explanation: 'pop() removes by key and returns value, del deletes the key, clear() empties the dictionary.',
        type: 'theory'
      },
      {
        question: 'What will this print?\n\nperson = {"a": 1, "b": 2}\nprint(person.get("c", 3))',
        options: ['1', '2', '3', 'Error'],
        correctAnswer: 2,
        explanation: 'get() returns the default value if the key does not exist.',
        type: 'question'
      },
      {
        question: 'Which method removes a key from a dictionary and returns its value?',
        options: ['del', 'pop()', 'remove()', 'clear()'],
        correctAnswer: 1,
        explanation: 'pop() removes a key and returns its value.',
        type: 'question'
      }
    ]
  }
},

// ------------------- Python If...Else -------------------
{
  id: 'python-if-else',
  title: 'Python If...Else',
  description: 'Learn how to execute code conditionally using if, elif, and else statements.',
  difficulty: 'Beginner',
  baseXP: 100,
  baselineTime: 1,
  language: 'python',
  category: 'Fundamentals',
  isLocked: false,
  content: {
    steps: [
      {
        title: 'Basic If Statement',
        content: 'Execute a block of code if a condition is True.',
        code: `age = 18
if age >= 18:
    print("Adult")`,
        explanation: 'The code inside the if block runs only when the condition is True.',
        type: 'theory'
      },
      {
        title: 'If...Else Statement',
        content: 'Provide an alternative block of code when the condition is False.',
        code: `age = 16
if age >= 18:
    print("Adult")
else:
    print("Minor")`,
        explanation: 'The else block runs when the if condition is False.',
        type: 'theory'
      },
      {
        title: 'Elif Statement',
        content: 'Check multiple conditions using elif.',
        code: `score = 75
if score >= 90:
    print("A")
elif score >= 70:
    print("B")
else:
    print("C")`,
        explanation: 'Elif allows checking additional conditions if previous conditions fail.',
        type: 'theory'
      },
      {
        title: 'Nested If Statements',
        content: 'Place if statements inside other if statements for complex conditions.',
        code: `num = 10
if num > 0:
    if num % 2 == 0:
        print("Positive even number")`,
        explanation: 'Nested ifs help check multiple conditions in sequence.',
        type: 'theory'
      },
      {
        question: 'What will this print?\n\nx = 5\nif x > 10:\n    print("A")\nelse:\n    print("B")',
        options: ['A', 'B', 'Nothing', 'Error'],
        correctAnswer: 1,
        explanation: 'Since 5 > 10 is False, the else block executes and prints B.',
        type: 'question'
      },
      {
        question: 'Which keyword checks additional conditions after an if statement?',
        options: ['else', 'elif', 'then', 'for'],
        correctAnswer: 1,
        explanation: 'elif allows checking another condition if the previous if is False.',
        type: 'question'
      }
    ]
  }
},
// ------------------- Python Match -------------------
{
  id: 'python-match',
  title: 'Python Match',
  description: 'Learn how to use the match-case statement (Python 3.10+) for pattern matching.',
  difficulty: 'Beginner',
  baseXP: 105,
  baselineTime: 1,
  language: 'python',
  category: 'Fundamentals',
  isLocked: false,
  content: {
    steps: [
      {
        title: 'Basic Match Statement',
        content: 'Use match to check the value of a variable and execute code accordingly.',
        code: `day = "Monday"
match day:
    case "Monday":
        print("Start of the week")
    case "Friday":
        print("End of the week")
    case _:
        print("Midweek")`,
        explanation: 'The underscore (_) acts as a default case if no matches are found.',
        type: 'theory'
      },
      {
        title: 'Multiple Patterns in One Case',
        content: 'Match multiple possible values in a single case using |.',
        code: `color = "red"
match color:
    case "red" | "blue":
        print("Primary color")
    case "green":
        print("Secondary color")`,
        explanation: 'The | operator allows matching multiple literals in one case.',
        type: 'theory'
      },
      {
        title: 'Using Variables in Match',
        content: 'Capture values from a pattern into variables.',
        code: `point = (1, 2)
match point:
    case (x, y):
        print(f"x={x}, y={y}")`,
        explanation: 'The pattern (x, y) extracts tuple elements into x and y.',
        type: 'theory'
      },
      {
        title: 'Match with Guard',
        content: 'Add an if condition (guard) to a case for more control.',
        code: `number = 10
match number:
    case x if x > 0:
        print("Positive")
    case x if x < 0:
        print("Negative")`,
        explanation: 'The if after case acts as a guard to add extra conditions.',
        type: 'theory'
      },
      {
        question: 'What will this print?\n\ncolor = "green"\nmatch color:\n    case "red" | "blue":\n        print("Primary")\n    case _:\n        print("Other")',
        options: ['Primary', 'Other', 'Error', 'Nothing'],
        correctAnswer: 1,
        explanation: 'Since "green" does not match "red" or "blue", the default case (_) executes.',
        type: 'question'
      },
      {
        question: 'Which symbol is used as a wildcard in a match statement?',
        options: ['*', '_', '?', '#'],
        correctAnswer: 1,
        explanation: 'The underscore (_) matches any value not matched by previous cases.',
        type: 'question'
      }
    ]
  }
},
  // ------------------- Python Operators -------------------
{
  id: 'python-operators',
  title: 'Python Operators',
  description: 'Learn how to perform operations on numbers and variables using Python operators.',
  difficulty: 'Beginner',
  baseXP: 110,
  baselineTime: 1,
  language: 'python',
  category: 'Fundamentals',
  isLocked: false,
  content: {
    steps: [
      {
        title: 'Arithmetic Operators',
        content: 'Perform basic arithmetic operations like addition, subtraction, multiplication, and division.',
        code: `x = 10
y = 3
print(x + y)  # 13
print(x - y)  # 7
print(x * y)  # 30
print(x / y)  # 3.3333`,
        explanation: 'Python uses +, -, *, /, // (floor division), % (modulus), ** (power) for arithmetic operations.',
        type: 'theory'
      },
      {
        title: 'Comparison Operators',
        content: 'Compare values using ==, !=, >, <, >=, <=.',
        code: `x = 5
y = 8
print(x == y)  # False
print(x < y)   # True`,
        explanation: 'Comparison operators return Boolean values based on the comparison.',
        type: 'theory'
      },
      {
        title: 'Assignment Operators',
        content: 'Assign and update values using =, +=, -=, *=, /=.',
        code: `x = 5
x += 3  # equivalent to x = x + 3
print(x)  # 8`,
        explanation: 'Assignment operators help modify variables concisely.',
        type: 'theory'
      },
      {
        title: 'Logical Operators',
        content: 'Combine Boolean expressions with and, or, not.',
        code: `a = True
b = False
print(a and b)  # False
print(a or b)   # True
print(not a)    # False`,
        explanation: 'Logical operators evaluate multiple conditions and return True or False.',
        type: 'theory'
      },
      {
        question: 'What will this print?\n\nx = 7\ny = 4\nprint(x % y)',
        options: ['3', '1', '0', 'Error'],
        correctAnswer: 0,
        explanation: '7 % 4 gives the remainder of 7 divided by 4, which is 3.',
        type: 'question'
      },
      {
        question: 'Which operator checks equality?',
        options: ['=', '==', '!=', '>='],
        correctAnswer: 1,
        explanation: '== compares two values for equality in Python.',
        type: 'question'
      }
    ]
  }
},
// ------------------- Python While Loops -------------------
{
  id: 'python-while-loops',
  title: 'Python While Loops',
  description: 'Learn how to repeat code as long as a condition is True using while loops.',
  difficulty: 'Beginner',
  baseXP: 115,
  baselineTime: 1,
  language: 'python',
  category: 'Loops',
  isLocked: false,
  content: {
    steps: [
      {
        title: 'Basic While Loop',
        content: 'Repeat code while a condition is True.',
        code: `i = 1
while i <= 5:
    print(i)
    i += 1`,
        explanation: 'The loop continues as long as i <= 5, incrementing i each time.',
        type: 'theory'
      },
      {
        title: 'While Loop with Break',
        content: 'Exit a loop early using break.',
        code: `i = 1
while True:
    print(i)
    if i == 3:
        break
    i += 1`,
        explanation: 'The break statement stops the loop immediately.',
        type: 'theory'
      },
      {
        title: 'While Loop with Continue',
        content: 'Skip the current iteration using continue.',
        code: `i = 0
while i < 5:
    i += 1
    if i == 3:
        continue
    print(i)`,
        explanation: 'Continue skips printing 3 and goes to the next loop iteration.',
        type: 'theory'
      },
      {
        title: 'While Loop with Else',
        content: 'An else block executes after the loop finishes normally.',
        code: `i = 1
while i <= 3:
    print(i)
    i += 1
else:
    print("Done")`,
        explanation: 'The else runs because the loop was not terminated with break.',
        type: 'theory'
      },
      {
        question: 'How many times will this loop run?\n\ni = 0\nwhile i < 3:\n    print(i)\n    i += 1',
        options: ['2', '3', '4', 'Infinite'],
        correctAnswer: 1,
        explanation: 'The loop runs for i = 0, 1, 2 → 3 times.',
        type: 'question'
      },
      {
        question: 'Which keyword immediately stops a while loop?',
        options: ['stop', 'exit', 'break', 'continue'],
        correctAnswer: 2,
        explanation: 'break exits the loop immediately.',
        type: 'question'
      }
    ]
  }
},

// ------------------- Python For Loops -------------------
{
  id: 'python-for-loops',
  title: 'Python For Loops',
  description: 'Learn how to iterate over sequences such as lists, strings, or ranges.',
  difficulty: 'Beginner',
  baseXP: 120,
  baselineTime: 1,
  language: 'python',
  category: 'Loops',
  isLocked: false,
  content: {
    steps: [
      {
        title: 'For Loop over a List',
        content: 'Iterate over each item in a list.',
        code: `fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)`,
        explanation: 'The loop executes once for each element in the list.',
        type: 'theory'
      },
      {
        title: 'For Loop with Range',
        content: 'Use range() to generate a sequence of numbers.',
        code: `for i in range(5):
    print(i)`,
        explanation: 'range(5) generates numbers 0 through 4.',
        type: 'theory'
      },
      {
        title: 'For Loop with Break',
        content: 'Stop the loop early using break.',
        code: `for i in range(5):
    if i == 3:
        break
    print(i)`,
        explanation: 'Loop stops when i equals 3, so 0, 1, 2 are printed.',
        type: 'theory'
      },
      {
        title: 'For Loop with Continue',
        content: 'Skip the current iteration using continue.',
        code: `for i in range(5):
    if i == 2:
        continue
    print(i)`,
        explanation: '2 is skipped, so output is 0, 1, 3, 4.',
        type: 'theory'
      },
      {
        question: 'What will this print?\n\nfor i in range(3):\n    print(i)',
        options: ['1, 2, 3', '0, 1, 2', '0, 1, 2, 3', 'Error'],
        correctAnswer: 1,
        explanation: 'range(3) generates 0, 1, 2.',
        type: 'question'
      },
      {
        question: 'Which keyword skips the current iteration of a for loop?',
        options: ['break', 'continue', 'pass', 'exit'],
        correctAnswer: 1,
        explanation: 'continue skips the rest of the current loop iteration.',
        type: 'question'
      }
    ]
  }
},

// ------------------- Python Arrays -------------------
{
  id: 'python-arrays',
  title: 'Python Arrays',
  description: 'Learn how to work with arrays using the array module for homogeneous data.',
  difficulty: 'Beginner',
  baseXP: 125,
  baselineTime: 1,
  language: 'python',
  category: 'Data Structures',
  isLocked: false,
  content: {
    steps: [
      {
        title: 'Creating an Array',
        content: 'Use the array module to create arrays.',
        code: `import array as arr
numbers = arr.array('i', [1, 2, 3, 4])
print(numbers)`,
        explanation: 'Array stores integers (typecode "i") in a contiguous memory structure.',
        type: 'theory'
      },
      {
        title: 'Accessing Array Elements',
        content: 'Access elements by index.',
        code: `print(numbers[0])  # First element
print(numbers[-1]) # Last element`,
        explanation: 'Use positive or negative indices to access array elements.',
        type: 'theory'
      },
      {
        title: 'Appending to an Array',
        content: 'Add an element using append().',
        code: `numbers.append(5)
print(numbers)`,
        explanation: 'The number 5 is added to the end of the array.',
        type: 'theory'
      },
      {
        title: 'Removing from an Array',
        content: 'Remove an element using remove().',
        code: `numbers.remove(2)
print(numbers)`,
        explanation: 'The value 2 is removed from the array.',
        type: 'theory'
      },
      {
        question: 'What is the typecode "i" used for in array.array("i", [...])?',
        options: ['Integer', 'Float', 'String', 'Boolean'],
        correctAnswer: 0,
        explanation: 'The typecode "i" indicates an array of integers.',
        type: 'question'
      },
      {
        question: 'Which method adds an element to the end of an array?',
        options: ['add()', 'append()', 'insert()', 'push()'],
        correctAnswer: 1,
        explanation: 'append() adds an element at the end of an array.',
        type: 'question'
      }
    ]
  }
},

// ------------------- Python Lists -------------------
{
  id: 'python-lists',
  title: 'Python Lists',
  description: 'Learn how to store multiple items in a single variable using lists and perform basic operations.',
  difficulty: 'Intermediate',
  baseXP: 140,
  baselineTime: 1,
  language: 'python',
  category: 'Fundamentals',
  isLocked: false,
  content: {
    steps: [
      {
        title: 'Creating a List',
        content: 'Lists can hold multiple items of any type.',
        code: `fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4]`,
        explanation: 'Lists are enclosed in square brackets [].',
        type: 'theory'
      },
      {
        title: 'Accessing List Items',
        content: 'Use indices to get items from a list.',
        code: `fruits = ["apple", "banana", "cherry"]
print(fruits[0])  # "apple"
print(fruits[-1]) # "cherry"`,
        explanation: 'Positive indices start from 0, negative indices start from the end.',
        type: 'theory'
      },
      {
        title: 'Modifying Lists',
        content: 'Add or change items in a list using append(), insert(), or direct assignment.',
        code: `fruits = ["apple", "banana"]
fruits.append("cherry")   # Add at the end
fruits[0] = "orange"      # Change first item
print(fruits)  # ["orange", "banana", "cherry"]`,
        explanation: 'Lists are mutable, so you can modify items.',
        type: 'theory'
      },
      {
        title: 'Removing Items',
        content: 'Use remove(), pop(), or del to remove items.',
        code: `fruits = ["apple", "banana", "cherry"]
fruits.remove("banana")
print(fruits)  # ["apple", "cherry"]`,
        explanation: 'Lists allow easy removal of elements by value or index.',
        type: 'theory'
      },
      {
        question: 'What will this print?\n\nnumbers = [1, 2, 3]\nnumbers.append(4)\nprint(numbers)',
        options: ['[1, 2, 3]', '[4]', '[1, 2, 3, 4]', '[1, 2, 4]'],
        correctAnswer: 2,
        explanation: 'append() adds 4 at the end of the list.',
        type: 'question'
      },
      {
        question: 'Which method removes a specific item by value?',
        options: ['pop()', 'remove()', 'del', 'clear()'],
        correctAnswer: 1,
        explanation: 'remove() deletes an item by specifying its value.',
        type: 'question'
      }
    ]
  }
},

// ------------------- Python Tuples -------------------
{
  id: 'python-tuples',
  title: 'Python Tuples',
  description: 'Learn how to store multiple items in an immutable sequence using tuples.',
  difficulty: 'Intermediate',
  baseXP: 150,
  baselineTime: 1,
  language: 'python',
  category: 'Fundamentals',
  isLocked: false,
  content: {
    steps: [
      {
        title: 'Creating a Tuple',
        content: 'Tuples store multiple items in parentheses and cannot be modified.',
        code: `my_tuple = ("apple", "banana", "cherry")
numbers = (1, 2, 3, 4)`,
        explanation: 'Tuples are similar to lists but immutable.',
        type: 'theory'
      },
      {
        title: 'Accessing Tuple Items',
        content: 'Use indices to access items in a tuple.',
        code: `fruits = ("apple", "banana", "cherry")
print(fruits[1])   # "banana"
print(fruits[-1])  # "cherry"`,
        explanation: 'Tuples support indexing like lists.',
        type: 'theory'
      },
      {
        title: 'Tuple Immutability',
        content: 'You cannot change a tuple item after creation.',
        code: `fruits = ("apple", "banana")
# fruits[0] = "orange"  # This will cause an error`,
        explanation: 'Trying to assign a new value raises a TypeError.',
        type: 'theory'
      },
      {
        title: 'Tuple Operations',
        content: 'You can concatenate or repeat tuples to create new ones.',
        code: `a = (1, 2)
b = (3, 4)
c = a + b
print(c)       # (1, 2, 3, 4)
print(a * 2)   # (1, 2, 1, 2)`,
        explanation: 'Operations return new tuples; the originals remain unchanged.',
        type: 'theory'
      },
      {
        question: 'Which of these will cause an error?\n\ntuple = (1, 2, 3)\ntuple[0] = 10',
        options: ['No error', 'Error', 'None', 'Prints 10'],
        correctAnswer: 1,
        explanation: 'Tuples are immutable; assigning a new value causes a TypeError.',
        type: 'question'
      },
      {
        question: 'What will this print?\n\nx = (1, 2)\nprint(x * 3)',
        options: ['(1, 2, 3)', '(1, 2, 1, 2, 1, 2)', 'Error', '(3, 6)'],
        correctAnswer: 1,
        explanation: 'Multiplying a tuple repeats its contents.',
        type: 'question'
      }
    ]
  }
},
// ------------------- Python Strings -------------------
  {
    id: 'python-strings-methods',
    title: 'Python Strings',
    description: 'Learn the most useful string methods in Python with examples and outputs.',
    difficulty: 'Intermediate',
    baseXP: 160,
    baselineTime: 5,
    language: 'python',
    category: 'Fundamentals',
    isLocked: false,
    content: {
      steps: [
        {
          title: 'Changing Case',
          content: 'You can change the case of strings using upper() and lower().',
          code: `text = "Hello World"
print(text.upper())
print(text.lower())`,
          explanation: `upper() converts all letters to uppercase.
lower() converts all letters to lowercase.`,
          type: 'theory'
        },
        {
          title: 'Trimming Whitespace',
          content: 'Use strip(), lstrip(), and rstrip() to remove whitespace.',
          code: `text = "   Python   "
print(text.strip())
print(text.lstrip())
print(text.rstrip())`,
          explanation: 'strip() removes spaces from both ends, lstrip() from the left, rstrip() from the right.',
          type: 'theory'
        },
        {
          title: 'Splitting and Joining',
          content: 'You can split a string into a list and join it back.',
          code: `text = "Python is fun"
words = text.split()
print(words)
joined = "-".join(words)
print(joined)`,
          explanation: 'split() divides string into words, join() merges list into a string.',
          type: 'theory'
        },
        {
          title: 'Finding and Replacing',
          content: 'You can find a substring and replace it.',
          code: `text = "I love Python"
print(text.find("Python"))
new_text = text.replace("Python", "Java")
print(new_text)`,
          explanation: 'find() returns the index of substring, replace() swaps old substring with new one.',
          type: 'theory'
        },
        {
          title: 'Checking Start/End',
          content: 'Check if a string starts or ends with a substring.',
          code: `text = "Python Programming"
print(text.startswith("Python"))
print(text.endswith("ing"))`,
          explanation: 'startswith() and endswith() return True or False.',
          type: 'theory'
        },
        {
          question: 'What will the following code output?\n\ntext = "Python"\nprint(text.upper())\nprint(text.lower())',
          options: ['PYTHON\npython', 'python\nPYTHON', 'Python\npython', 'PYTHON\nPython'],
          correctAnswer: 0,
          explanation: 'upper() converts to uppercase, lower() to lowercase.',
          type: 'question'
        },
        {
          question: 'Which method splits a string into a list?',
          options: ['split()', 'join()', 'strip()', 'replace()'],
          correctAnswer: 0,
          explanation: 'split() divides a string into a list of substrings.',
          type: 'question'
        }
      ]
    }
  },
  // ------------------- Python Lists -------------------
  {
    id: 'python-lists-methods',
    title: 'Python List  Methods',
    description: 'Learn the most useful list methods in Python with examples and outputs.',
    difficulty: 'Intermediate',
    baseXP: 170,
    baselineTime: 5,
    language: 'python',
    category: 'Fundamentals',
    isLocked: false,
    content: {
      steps: [
        {
          title: 'Adding Elements',
          content: 'Use append() to add a single element and extend() to add multiple elements.',
          code: `numbers = [1, 2, 3]
numbers.append(4)
print(numbers)
numbers.extend([5, 6])
print(numbers)`,
          explanation: 'append() adds one element, extend() adds multiple from another iterable.',
          type: 'theory'
        },
        {
          title: 'Inserting Elements',
          content: 'Insert an element at a specific position with insert().',
          code: `numbers = [1, 2, 3]
numbers.insert(1, 10)
print(numbers)`,
          explanation: 'insert(index, value) places value at the given index.',
          type: 'theory'
        },
        {
          title: 'Removing Elements',
          content: 'Remove elements using remove() or pop().',
          code: `numbers = [1, 2, 3, 2]
numbers.remove(2)
print(numbers)
popped = numbers.pop()
print(popped, numbers)`,
          explanation: 'remove(x) deletes first occurrence, pop() removes and returns last element by default.',
          type: 'theory'
        },
        {
          title: 'Sorting and Reversing',
          content: 'Sort the list or reverse its order.',
          code: `numbers = [3, 1, 4, 2]
numbers.sort()
print(numbers)
numbers.reverse()
print(numbers)`,
          explanation: 'sort() arranges ascending, reverse() flips order.',
          type: 'theory'
        },
        {
          title: 'Counting and Indexing',
          content: 'Count occurrences and find index.',
          code: `numbers = [1, 2, 2, 3]
print(numbers.count(2))
print(numbers.index(3))`,
          explanation: 'count(x) counts occurrences, index(x) returns first index of x.',
          type: 'theory'
        },
        {
          question: 'What will this code output?\n\nnumbers = [1, 2, 3]\nnumbers.append(4)\nprint(numbers)',
          options: ['[1, 2, 3]', '[1, 2, 3, 4]', '[4, 1, 2, 3]', '[1, 2, 4, 3]'],
          correctAnswer: 1,
          explanation: 'append() adds 4 to the end of the list.',
          type: 'question'
        },
        {
          question: 'Which method removes the first occurrence of an element?',
          options: ['pop()', 'remove()', 'append()', 'extend()'],
          correctAnswer: 1,
          explanation: 'remove(x) deletes the first occurrence of x in the list.',
          type: 'question'
        }
      ]
    }
  },
  // ------------------- Python Sets -------------------
  {
    id: 'python-sets-methods',
    title: 'Python Set Methods',
    description: 'Learn the most useful set methods in Python with examples and outputs.',
    difficulty: 'Intermediate',
    baseXP: 180,
    baselineTime: 5,
    language: 'python',
    category: 'Fundamentals',
    isLocked: false,
    content: {
      steps: [
        {
          title: 'Creating and Adding Elements',
          content: 'Use add() to insert a single element and update() to add multiple elements.',
          code: `fruits = {"apple", "banana"}
fruits.add("orange")
print(fruits)
fruits.update(["kiwi", "mango"])
print(fruits)`,
          explanation: 'add() adds one element, update() adds multiple elements from an iterable.',
          type: 'theory'
        },
        {
          title: 'Removing Elements',
          content: 'Remove elements using remove(), discard(), or pop().',
          code: `fruits = {"apple", "banana", "orange"}
fruits.remove("banana")
print(fruits)
fruits.discard("kiwi")  # No error even if not present
popped = fruits.pop()
print(popped, fruits)`,
          explanation: 'remove() deletes an element and raises an error if missing, discard() is safe, pop() removes arbitrary element.',
          type: 'theory'
        },
        {
          title: 'Clearing a Set',
          content: 'Remove all elements using clear().',
          code: `fruits = {"apple", "orange"}
fruits.clear()
print(fruits)`,
          explanation: 'clear() empties the set.',
          type: 'theory'
        },
        {
          question: 'What will the following code output?\n\nfruits = {"apple", "banana"}\nfruits.add("orange")\nprint(fruits)',
          options: ['{"apple", "banana"}', '{"orange"}', '{"apple", "banana", "orange"}', '["apple", "banana", "orange"]'],
          correctAnswer: 2,
          explanation: 'add() inserts "orange" into the set.',
          type: 'question'
        },
        {
          question: 'Which method removes an element safely even if it is not present?',
          options: ['remove()', 'discard()', 'pop()', 'clear()'],
          correctAnswer: 1,
          explanation: 'discard() does not raise an error if the element is missing.',
          type: 'question'
        }
      ]
    }
  },
// ------------------- Python Dictionaries -------------------
  {
    id: 'python-dictionaries-methods',
    title: 'Python Dictionary Methods',
    description: 'Learn the most useful dictionary methods in Python with examples and outputs.',
    difficulty: 'Intermediate',
    baseXP: 190,
    baselineTime: 5,
    language: 'python',
    category: 'Fundamentals',
    isLocked: false,
    content: {
      steps: [
        {
          title: 'Accessing and Updating Values',
          content: 'Use get() to safely access values and update() to merge dictionaries.',
          code: `person = {"name": "Alice", "age": 25}
print(person.get("name"))
print(person.get("city", "Unknown"))
person.update({"city": "Paris"})
print(person)`,
          explanation: 'get() returns value or default, update() merges dictionaries.',
          type: 'theory'
        },
        {
          title: 'Adding and Removing Items',
          content: 'Add key-value pairs directly and remove them with pop().',
          code: `person = {"name": "Alice"}
person["age"] = 25
print(person)
age = person.pop("age")
print(age, person)`,
          explanation: 'You can add a new key-value pair by assignment, pop() removes a key and returns its value.',
          type: 'theory'
        },
        {
          title: 'Getting Keys, Values, and Items',
          content: 'Retrieve keys, values, or key-value pairs.',
          code: `person = {"name": "Alice", "age": 25}
print(person.keys())
print(person.values())
print(person.items())`,
          explanation: 'keys() returns all keys, values() returns all values, items() returns key-value pairs.',
          type: 'theory'
        },
        {
          title: 'Clearing a Dictionary',
          content: 'Remove all entries with clear().',
          code: `person = {"name": "Alice", "age": 25}
person.clear()
print(person)`,
          explanation: 'clear() empties the dictionary.',
          type: 'theory'
        },
        {
          question: 'What will this code output?\n\nperson = {"name": "Alice"}\nperson["age"] = 25\nprint(person)',
          options: ['{"name": "Alice"}', '{"age": 25}', '{"name": "Alice", "age": 25}', '{"name": "Alice", "age": 25, "city": "Paris"}'],
          correctAnswer: 2,
          explanation: 'Adding a new key-value pair updates the dictionary.',
          type: 'question'
        },
        {
          question: 'Which method returns all key-value pairs in a dictionary?',
          options: ['keys()', 'values()', 'items()', 'get()'],
          correctAnswer: 2,
          explanation: 'items() returns all key-value pairs as tuples.',
          type: 'question'
        }
      ]
    }
  },
// ------------------- Python Functions -------------------
{
  id: 'python-functions',
  title: 'Python Functions',
  description: 'Learn how to define and use functions to organize reusable code.',
  difficulty: 'Intermediate',
  baseXP: 200,
  baselineTime: 1.5,
  language: 'python',
  category: 'Functions',
  isLocked: false,
  content: {
    steps: [
      {
        title: 'Defining a Simple Function',
        content: 'Use def to define a function.',
        code: `def greet():
    print("Hello, world!")

greet()`,
        explanation: 'The function greet() prints a message when called.',
        type: 'theory'
      },
      {
        title: 'Function with Parameters',
        content: 'Functions can take inputs (parameters).',
        code: `def greet(name):
    print(f"Hello, {name}!")

greet("Jason")`,
        explanation: 'The name parameter is passed to the function to customize the message.',
        type: 'theory'
      },
      {
        title: 'Function Returning a Value',
        content: 'Use return to send a result back from a function.',
        code: `def add(a, b):
    return a + b

result = add(3, 5)
print(result)`,
        explanation: 'The add function returns the sum, which is stored in result.',
        type: 'theory'
      },
      {
        title: 'Default Parameter Values',
        content: 'Set default values for parameters.',
        code: `def greet(name="Guest"):
    print(f"Hello, {name}!")

greet()
greet("Bob")`,
        explanation: 'If no argument is given, name defaults to "Guest".',
        type: 'theory'
      },
      {
        question: 'What will this print?\n\ndef add(a, b):\n    return a + b\n\nprint(add(2, 3))',
        options: ['2', '3', '5', '23'],
        correctAnswer: 2,
        explanation: '2 + 3 equals 5, so the output is 5.',
        type: 'question'
      },
      {
        question: 'How do you define a function in Python?',
        options: ['function myFunc():', 'def myFunc():', 'func myFunc():', 'function: myFunc()'],
        correctAnswer: 1,
        explanation: 'Python uses def to define functions.',
        type: 'question'
      }
    ]
  }
},

// ------------------- Python Lambda -------------------
{
  id: 'python-lambda',
  title: 'Python Lambda',
  description: 'Learn how to create small anonymous functions using lambda.',
  difficulty: 'Intermediate',
  baseXP: 210,
  baselineTime: 1.5,
  language: 'python',
  category: 'Functions',
  isLocked: false,
  content: {
    steps: [
      {
        title: 'Simple Lambda Function',
        content: 'Use lambda to create a function without a name.',
        code: `add = lambda x, y: x + y   #Output: 5
print(add(2, 3))`,
        explanation: 'The lambda function adds two numbers and returns the result.',
        type: 'theory'
      },
      {
        title: 'Lambda in a List',
        content: 'Use lambda to apply a function to elements in a list with map().',
        code: `nums = [1, 2, 3]
squared = list(map(lambda x: x**2, nums))   
print(squared) #  Output: [1, 4, 9]`, 
        explanation: 'map applies the lambda function to each item in nums.',
        type: 'theory'
      },
      {
        title: 'Lambda with Filter',
        content: 'Use lambda to filter a list.',
        code: `nums = [1, 2, 3, 4, 5]
even = list(filter(lambda x: x % 2 == 0, nums))
print(even)   # Output: [2, 4]`,
        explanation: 'filter keeps only the elements that satisfy the lambda condition.',
        type: 'theory'
      },
      {
        title: 'Lambda with Sort',
        content: 'Sort a list of tuples using lambda as key.',
        code: `points = [(1, 2), (3, 1), (5, 0)]
points.sort(key=lambda x: x[1])
print(points)   # Output: [(5, 0), (3, 1), (1, 2)]`,
        explanation: 'The lambda selects the second element of each tuple for sorting.',
        type: 'theory'
      },
      {
        question: 'What will this print?\n\nsquare = lambda x: x**2\nprint(square(4))',
        options: ['2', '4', '8', '16'],
        correctAnswer: 3,
        explanation: '4 squared is 16.',
        type: 'question'
      },
      {
        question: 'Which keyword is used to create a lambda function?',
        options: ['def', 'lambda', 'func', 'function'],
        correctAnswer: 1,
        explanation: 'lambda defines anonymous functions in Python.',
        type: 'question'
      }
    ]
  }
},

// ------------------- Python OOP -------------------
{
  id: 'python-oop',
  title: 'Python OOP',
  description: 'Learn the basics of Object-Oriented Programming in Python.',
  difficulty: 'Intermediate',
  baseXP: 220,
  baselineTime: 1.5,
  language: 'python',
  category: 'OOP',
  isLocked: false,
  content: {
    steps: [
      {
        title: 'What is OOP?',
        content: 'OOP stands for Object-Oriented Programming. It allows you to model real-world objects in code.',
        code: '',
        explanation: 'OOP uses classes and objects to organize and structure code efficiently.',
        type: 'theory'
      },
      {
        title: 'Creating a Simple Class',
        content: 'Define a class using the class keyword.',
        code: `class Person:
    pass`,
        explanation: 'This defines an empty class named Person.',
        type: 'theory'
      },
      {
        title: 'Creating an Object',
        content: 'Instantiate an object from a class.',
        code: `person1 = Person()
print(person1)`,
        explanation: 'person1 is an object of class Person.',
        type: 'theory'
      },
      {
        title: 'Adding Attributes',
        content: 'Use __init__() to initialize object attributes.',
        code: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

person1 = Person("Jason", 25)
print(person1.name, person1.age)`,
        explanation: 'The __init__() method sets the name and age for each object.',
        type: 'theory'
      },
      {
        question: 'What does OOP stand for?',
        options: ['Object-Oriented Programming', 'Open Operational Procedure', 'Output-Oriented Python', 'Object Optimization Programming'],
        correctAnswer: 0,
        explanation: 'OOP stands for Object-Oriented Programming.',
        type: 'question'
      },
      {
        question: 'Which keyword is used to define a class?',
        options: ['def', 'class', 'object', 'init'],
        correctAnswer: 1,
        explanation: 'class is used to define classes in Python.',
        type: 'question'
      }
    ]
  }
},

// ------------------- Python Classes/Objects -------------------
{
  id: 'python-classes-objects',
  title: 'Python Classes and Objects',
  description: 'Learn to create classes and objects, and add methods and attributes.',
  difficulty: 'Intermediate',
  baseXP: 230,
  baselineTime: 1.5,
  language: 'python',
  category: 'OOP',
  isLocked: false,
  content: {
    steps: [
      {
        title: 'Adding Methods',
        content: 'Methods are functions inside classes.',
        code: `class Person:
    def __init__(self, name):
        self.name = name

    def greet(self):
        print(f"Hello, {self.name}!")

person1 = Person("Bob")
person1.greet()`,
        explanation: 'The greet() method prints a message using the object’s name.',
        type: 'theory'
      },
      {
        title: 'Accessing Attributes',
        content: 'Use dot notation to access attributes.',
        code: `person1 = Person("Charlie")
print(person1.name)`,
        explanation: 'person1.name retrieves the name attribute of the object.',
        type: 'theory'
      },
      {
        title: 'Modifying Attributes',
        content: 'Change attribute values directly.',
        code: `person1.age = 30
print(person1.age)`,
        explanation: 'You can assign new values to object attributes after creation.',
        type: 'theory'
      },
      {
        title: 'Deleting Attributes',
        content: 'Remove an attribute with del.',
        code: `del person1.age`,
        explanation: 'The age attribute is removed from person1.',
        type: 'theory'
      },
      {
        question: 'Which symbol is used to access object attributes?',
        options: ['->', '.', '::', ':'],
        correctAnswer: 1,
        explanation: 'The dot (.) notation accesses attributes and methods.',
        type: 'question'
      },
      {
        question: 'Which method initializes object attributes?',
        options: ['__init__', '__start__', '__create__', '__main__'],
        correctAnswer: 0,
        explanation: '__init__ is the constructor method in Python classes.',
        type: 'question'
      }
    ]
  }
},


// ------------------- Python Inheritance -------------------
{
  id: 'python-inheritance',
  title: 'Python Inheritance',
  description: 'Learn how to create classes that inherit properties and methods from other classes.',
  difficulty: 'Intermediate',
  baseXP: 240,
  baselineTime: 1.5,
  language: 'python',
  category: 'Classes & OOP',
  isLocked: false,
  content: {
    steps: [
      {
        title: 'Simple Inheritance',
        content: 'A child class can inherit attributes and methods from a parent class.',
        code: `class Animal:
    def speak(self):
        print("Some sound")

class Dog(Animal):
    pass

dog = Dog()
dog.speak()`,
        explanation: 'Dog inherits the speak() method from Animal.',
        type: 'theory'
      },
      {
        title: 'Overriding Methods',
        content: 'Child class can override a parent method.',
        code: `class Animal:
    def speak(self):
        print("Some sound")

class Dog(Animal):
    def speak(self):
        print("Woof!")

dog = Dog()
dog.speak()`,
        explanation: 'Dog overrides the speak() method to print "Woof!" instead of the parent method.',
        type: 'theory'
      },
      {
        title: 'Using super()',
        content: 'Call the parent method using super().',
        code: `class Animal:
    def __init__(self, name):
        self.name = name

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)
        self.breed = breed

dog = Dog("Buddy", "Golden Retriever")
print(dog.name, dog.breed)`,
        explanation: 'super() calls the parent __init__ to initialize name, while Dog adds breed.',
        type: 'theory'
      },
      {
        title: 'Multiple Inheritance',
        content: 'A class can inherit from multiple parent classes.',
        code: `class Flyer:
    def fly(self):
        print("I can fly")

class Swimmer:
    def swim(self):
        print("I can swim")

class Duck(Flyer, Swimmer):
    pass

duck = Duck()
duck.fly()
duck.swim()`,
        explanation: 'Duck inherits methods from both Flyer and Swimmer classes.',
        type: 'theory'
      },
      {
        question: 'What will this print?\n\nclass Animal:\n    def speak(self):\n        print("Sound")\n\nclass Cat(Animal):\n    pass\n\ncat = Cat()\ncat.speak()',
        options: ['Sound', 'Cat', 'Error', 'None'],
        correctAnswer: 0,
        explanation: 'Cat inherits speak() from Animal, so it prints "Sound".',
        type: 'question'
      },
      {
        question: 'How do you call a parent class method inside a child class?',
        options: ['parent.method()', 'super().method()', 'self.parent()', 'call Parent.method()'],
        correctAnswer: 1,
        explanation: 'In Python, super() is used to call the parent class method.',
        type: 'question'
      }
    ]
  }
},

// ------------------- Python Iterators -------------------
{
  id: 'python-iterators',
  title: 'Python Iterators (Classes)',
  description: 'Learn how to make a class that can be looped over using for.',
  difficulty: 'Intermediate',
  baseXP: 250,
  baselineTime: 1.5,
  language: 'python',
  category: 'Classes & Objects',
  isLocked: false,
  content: {
    steps: [
      {
        title: 'Simple Iterator Class',
        content: 'A class can produce numbers one by one.',
        code: `class CountToThree:
    def __init__(self):
        self.num = 1

    def __iter__(self):
        return self

    def __next__(self):
        if self.num <= 3:
            n = self.num
            self.num += 1
            return n
        else:
            raise StopIteration

for i in CountToThree():
    print(i)
#Output: 1,2,3`,
        explanation: 'This prints 1, 2, 3. __next__ gives the next number each time.',
        type: 'theory'
      },
      {
        title: 'Iterator Over a List',
        content: 'You can make a class that loops over a list.',
        code: `class MyList:
    def __init__(self, items):
        self.items = items
        self.index = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.index < len(self.items):
            value = self.items[self.index]
            self.index += 1
            return value
        else:
            raise StopIteration

for item in MyList(["a", "b"]):
    print(item)
# Output: a, b`,
        explanation: 'This prints "a" and "b". The class keeps track of position with index.',
        type: 'theory'
      },
      {
        title: 'Custom Stop Condition',
        content: 'You can stop after any rule you like.',
        code: `class EvenNumbers:
    def __init__(self, max_num):
        self.num = 0
        self.max_num = max_num

    def __iter__(self):
        return self

    def __next__(self):
        self.num += 2
        if self.num <= self.max_num:
            return self.num
        else:
            raise StopIteration

for n in EvenNumbers(6):
    print(n)
# Output: 2, 4, 6`,
        explanation: 'Prints 2, 4, 6. The iterator stops after max_num.',
        type: 'theory'
      },
      {
        title: 'Reuse Iterator Class',
        content: 'The same class can loop over different numbers or lists.',
        code: `for i in CountToThree():
    print(i)
# Output: 1, 2, 3

for n in EvenNumbers(4):
    print(n)
# Output: 2, 4`,
        explanation: 'You can use your iterator class again with a different limit.',
        type: 'theory'
      },
      {
        question: 'Which two methods make a class an iterator?',
        options: ['__init__ and __call__', '__iter__ and __next__', '__str__ and __repr__', '__start__ and __end__'],
        correctAnswer: 1,
        explanation: 'Classes need __iter__() and __next__() to work as iterators.',
        type: 'question'
      },
      {
        question: 'What happens when an iterator reaches its end?',
        options: ['Returns None', 'Raises StopIteration', 'Resets automatically', 'Prints 0'],
        correctAnswer: 1,
        explanation: 'When an iterator is exhausted, __next__() must raise StopIteration.',
        type: 'question'
      }
    ]
  }
},


// ------------------- Python Polymorphism -------------------
{
  id: 'python-polymorphism',
  title: 'Python Polymorphism (Classes)',
  description: 'Learn about polymorphism in Python using simple classes.',
  difficulty: 'Intermediate',
  baseXP: 260,
  baselineTime: 1.5,
  language: 'python',
  category: 'Classes & Objects',
  isLocked: false,
  content: {
    steps: [
      {
        title: 'Polymorphism with Methods',
        content: 'Different classes can have the same method name.',
        code: `class Cat:
    def speak(self):
        print("Meow")

class Dog:
    def speak(self):
        print("Woof")

animals = [Cat(), Dog()]
for animal in animals:
    animal.speak()
# Output:
# Meow
# Woof`,
        explanation: 'Both classes have speak(), showing polymorphism: same method name, different behavior.',
        type: 'theory'
      },
      {
        title: 'Polymorphism with Inheritance',
        content: 'A subclass can change the method of its parent.',
        code: `class Animal:
    def speak(self):
        print("Some sound")

class Dog(Animal):
    def speak(self):
        print("Woof")

d = Dog()
d.speak()
# Output: Woof`,
        explanation: 'Dog overrides speak() of Animal, demonstrating polymorphism.',
        type: 'theory'
      },
      {
        title: 'Function Works with Any Polymorphic Object',
        content: 'You can pass any object with the same method to a function.',
        code: `def make_speak(animal):
    animal.speak()

make_speak(Cat())
make_speak(Dog())
# Output: Meow, Woof`,
        explanation: 'The function works with any object that has a speak() method.',
        type: 'theory'
      },
      {
        title: 'Multiple Classes Together',
        content: 'Different classes can be used together if they share a method.',
        code: `class Bird:
    def speak(self):
        print("Tweet")

animals = [Dog(), Cat(), Bird()]
for a in animals:
    a.speak()
# Output: Woof, Meow, Tweet`,
        explanation: 'Any class with a speak() method can be used in the same loop.',
        type: 'theory'
      },
      {
        question: 'What is shown when different classes have the same method name?',
        options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'],
        correctAnswer: 1,
        explanation: 'Polymorphism allows objects of different classes to respond to the same method name differently.',
        type: 'question'
      },
      {
        question: 'What can a subclass do to a parent class method?',
        options: ['Override it', 'Hide it', 'Delete it', 'Nothing'],
        correctAnswer: 0,
        explanation: 'A subclass can override any parent method to provide its own version.',
        type: 'question'
      }
    ]
  }
},

// ------------------- Python Scope -------------------
{
  id: 'python-scope',
  title: 'Python Scope',
  description: 'Learn about variable scope: local, global, and how Python determines variable visibility.',
  difficulty: 'Intermediate',
  baseXP: 270,
  baselineTime: 1.5,
  language: 'python',
  category: 'Variables & Functions',
  isLocked: false,
  content: {
    steps: [
      {
        title: 'Local Scope',
        content: 'Variables defined inside a function are local to that function.',
        code: `def my_func():
    x = 10
    print(x)

my_func()
# print(x)  # This would cause an error`,
        explanation: 'x exists only inside my_func and cannot be accessed outside.',
        type: 'theory'
      },
      {
        title: 'Global Scope',
        content: 'Variables defined outside functions are global and accessible inside functions.',
        code: `x = 5

def my_func():
    print(x)

my_func()
print(x)`,
        explanation: 'x is a global variable and can be used both inside and outside the function.',
        type: 'theory'
      },
      {
        title: 'Modifying Global Variables',
        content: 'Use global keyword to modify global variables inside a function.',
        code: `x = 10

def my_func():
    global x
    x = 20

my_func()
print(x)`,
        explanation: 'Without global, modifying x inside the function would create a local variable. With global, it modifies the global x.',
        type: 'theory'
      },
      {
        title: 'Nested Functions and Nonlocal',
        content: 'Use nonlocal to modify a variable in the enclosing function.',
        code: `def outer():
    x = 5
    def inner():
        nonlocal x
        x = 10
    inner()
    print(x)

outer()`,
        explanation: 'nonlocal allows inner() to modify x in outer(), demonstrating nested scope.',
        type: 'theory'
      },
      {
        question: 'What will this print?\n\ndef func():\n    x = 1\n    print(x)\nfunc()\n# print(x)',
        options: ['1 Error', '1 1', 'Error 1', '0'],
        correctAnswer: 0,
        explanation: 'x is local to func(), so print(x) inside prints 1, but outside would cause an error.',
        type: 'question'
      },
      {
        question: 'Which keyword allows a variable to go from local to global scope?',
        options: ['local', 'nonlocal', 'global', 'modify'],
        correctAnswer: 2,
        explanation: 'The global keyword tells Python to use the global variable instead of creating a local one.',
        type: 'question'
      }
    ]
  }
},

// ------------------- Python Modules -------------------
{
  id: 'python-modules',
  title: 'Python Modules',
  description: 'Learn how to organize code into modules and import them for reuse.',
  difficulty: 'Intermediate',
  baseXP: 280,
  baselineTime: 1.5,
  language: 'python',
  category: 'Modules & Libraries',
  isLocked: false,
  content: {
    steps: [
      {
        title: 'Importing a Module',
        content: 'Use import to include a module in your code.',
        code: `import math

print(math.sqrt(16))`,
        explanation: 'math module provides mathematical functions like sqrt().',
        type: 'theory'
      },
      {
        title: 'Importing Specific Functions',
        content: 'Use from ... import to import only specific functions.',
        code: `from math import pi

print(pi)`,
        explanation: 'Only the pi constant is imported from math, not the entire module.',
        type: 'theory'
      },
      {
        title: 'Using Aliases',
        content: 'Use as to give a module or function a different name.',
        code: `import math as m

print(m.sqrt(25))`,
        explanation: 'math module is aliased as m for convenience.',
        type: 'theory'
      },
      {
        title: 'Creating Your Own Module',
        content: 'Save functions in a .py file and import them.',
        code: `# mymodule.py
def greet(name):
    print(f"Hello, {name}!")

# main.py
from mymodule import greet

greet("Jason")`,
        explanation: 'You can create reusable modules and import functions into other scripts.',
        type: 'theory'
      },
      {
        question: 'How do you import only the sqrt function from the math module?',
        options: ['import math.sqrt', 'from math import sqrt', 'import sqrt from math', 'math import sqrt'],
        correctAnswer: 1,
        explanation: 'The correct syntax is from math import sqrt.',
        type: 'question'
      },
      {
        question: 'Which keyword allows you to give a module an alias?',
        options: ['alias', 'as', 'rename', 'module'],
        correctAnswer: 1,
        explanation: 'Use as to assign an alias to a module, e.g., import math as m.',
        type: 'question'
      }
    ]
  }
},
// ------------------- Python Dates -------------------
{
  id: 'python-dates',
  title: 'Python Dates',
  description: 'Learn how to work with dates and times using the datetime module.',
  difficulty: 'Intermediate',
  baseXP: 290,
  baselineTime: 1.5,
  language: 'python',
  category: 'Date & Time',
  isLocked: false,
  content: {
    steps: [
      {
        title: 'Getting Current Date and Time',
        content: 'Use datetime.now() to get the current date and time.',
        code: `from datetime import datetime

now = datetime.now()
print(now)`,
        explanation: 'datetime.now() returns the current date and time as a datetime object.',
        type: 'theory'
      },
      {
        title: 'Accessing Date Components',
        content: 'You can access year, month, day, etc. from a datetime object.',
        code: `from datetime import datetime

now = datetime.now()
print(now.year)
print(now.month)
print(now.day)`,
        explanation: 'You can extract individual components like year, month, and day from datetime.',
        type: 'theory'
      },
      {
        title: 'Creating a Specific Date',
        content: 'Create a datetime object with specific values.',
        code: `from datetime import datetime

my_date = datetime(2025, 8, 15, 12, 30)
print(my_date)`,
        explanation: 'You can specify year, month, day, hour, minute, and second when creating a datetime object.',
        type: 'theory'
      },
      {
        title: 'Formatting Dates',
        content: 'Use strftime() to format dates as strings.',
        code: `from datetime import datetime

now = datetime.now()
print(now.strftime("%Y-%m-%d %H:%M:%S"))`,
        explanation: 'strftime() formats datetime into a readable string using format codes.',
        type: 'theory'
      },
      {
        question: 'Which method gives the current date and time?',
        options: ['datetime.today()', 'datetime.now()', 'datetime.current()', 'datetime.get()'],
        correctAnswer: 1,
        explanation: 'datetime.now() returns the current date and time.',
        type: 'question'
      },
      {
        question: 'How do you format a datetime object as "YYYY-MM-DD"?',
        options: ['strftime("%Y-%m-%d")', 'format("%Y-%m-%d")', 'to_string("%Y-%m-%d")', 'date("%Y-%m-%d")'],
        correctAnswer: 0,
        explanation: 'strftime("%Y-%m-%d") formats a datetime object into the specified string format.',
        type: 'question'
      }
    ]
  }
},
// ------------------- Python Math -------------------
{
  id: 'python-math',
  title: 'Python Math',
  description: 'Learn how to use Python’s math module for mathematical operations.',
  difficulty: 'Intermediate',
  baseXP: 300,
  baselineTime: 1.5,
  language: 'python',
  category: 'Math & Numbers',
  isLocked: false,
  content: {
    steps: [
      {
        title: 'Using Basic Math Functions',
        content: 'Import math to access common math functions.',
        code: `import math

print(math.sqrt(16))
print(math.pow(2, 3))`,
        explanation: 'sqrt() calculates square root, pow() raises a number to a power.',
        type: 'theory'
      },
      {
        title: 'Rounding Numbers',
        content: 'Use ceil(), floor(), and round() to round numbers.',
        code: `import math

print(math.ceil(4.2))
print(math.floor(4.8))
print(round(4.5))`,
        explanation: 'ceil() rounds up, floor() rounds down, round() rounds to nearest integer.',
        type: 'theory'
      },
      {
        title: 'Trigonometric Functions',
        content: 'Use sin(), cos(), and tan() for trigonometry.',
        code: `import math

print(math.sin(math.pi/2))
print(math.cos(0))
print(math.tan(math.pi/4))`,
        explanation: 'math.sin, math.cos, and math.tan calculate trigonometric values in radians.',
        type: 'theory'
      },
      {
        title: 'Constants in Math Module',
        content: 'Use constants like pi and e from math.',
        code: `import math

print(math.pi)
print(math.e)`,
        explanation: 'math.pi and math.e provide commonly used mathematical constants.',
        type: 'theory'
      },
      {
        question: 'Which function calculates the square root of a number?',
        options: ['math.pow()', 'math.sqrt()', 'math.round()', 'math.ceil()'],
        correctAnswer: 1,
        explanation: 'math.sqrt() calculates the square root of a number.',
        type: 'question'
      },
      {
        question: 'What will math.ceil(4.2) return?',
        options: ['4', '5', '4.2', 'Error'],
        correctAnswer: 1,
        explanation: 'math.ceil() rounds a number up to the nearest integer, so 4.2 becomes 5.',
        type: 'question'
      }
    ]
  }
},


// ------------------- Python JSON -------------------
{
  id: 'python-json',
  title: 'Python JSON',
  description: 'Learn how to work with JSON data using Pythons json module.',
  difficulty:'Intermediate',
  baseXP: 310,
  baselineTime: 1.5,
  language: 'python',
  category: 'Data Handling',
  isLocked: false,
  content: {
    steps: [
      {
        title: 'Importing JSON Module',
        content: 'Use import json to work with JSON data.',
        code: `import json

data = '{"name": "Jason", "age": 25}'
parsed = json.loads(data)
print(parsed)`,
        explanation: 'json.loads() converts a JSON string into a Python dictionary.',
        type: 'theory'
      },
      {
        title: 'Converting Python Object to JSON',
        content: 'Use json.dumps() to convert Python objects to JSON strings.',
        code: `import json

person = {"name": "Bob", "age": 30}
json_str = json.dumps(person)
print(json_str)`,
        explanation: 'json.dumps() converts a Python dictionary into a JSON formatted string.',
        type: 'theory'
      },
      {
        title: 'Accessing Data',
        content: 'Once parsed, access data like a regular dictionary.',
        code: `import json

data = '{"name": "Jason", "age": 25}'
parsed = json.loads(data)
print(parsed["name"])
print(parsed["age"])`,
        explanation: 'You can access JSON values by their keys after parsing into a Python dictionary.',
        type: 'theory'
      },
      {
        title: 'Writing JSON to a File',
        content: 'Use json.dump() to write Python objects to a JSON file.',
        code: `import json

person = {"name": "Bob", "age": 30}
with open("person.json", "w") as file:
    json.dump(person, file)`,
        explanation: 'json.dump() writes a Python object as JSON into a file.',
        type: 'theory'
      },
      {
        question: 'Which function parses a JSON string into a Python object?',
        options: ['json.dumps()', 'json.loads()', 'json.dump()', 'json.read()'],
        correctAnswer: 1,
        explanation: 'json.loads() parses a JSON string into a Python dictionary or list.',
        type: 'question'
      },
      {
        question: 'How do you convert a Python dictionary to a JSON string?',
        options: ['json.load()', 'json.parse()', 'json.dumps()', 'json.write()'],
        correctAnswer: 2,
        explanation: 'json.dumps() converts a Python object into a JSON formatted string.',
        type: 'question'
      }
    ]
  }
},
// ------------------- Python PIP -------------------
{
  id: "python-pip",
  title: "Python PIP",
  description: "Learn how to manage Python packages using PIP.",
  difficulty: 'Advanced',
  baseXP: 330,
  baselineTime: 1.5,
  language: "python",
  category: "Modules & Packages",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Installing a Package",
        content: "Use pip install to install packages.",
        code: "pip install requests",
        explanation: "This command installs the 'requests' package, which allows HTTP requests.",
        type: "theory"
      },
      {
        title: "Checking Installed Packages",
        content: "Use pip list to see installed packages.",
        code: "pip list",
        explanation: "Lists all Python packages currently installed in your environment.",
        type: "theory"
      },
      {
        title: "Upgrading a Package",
        content: "Use pip install --upgrade to update packages.",
        code: "pip install --upgrade requests",
        explanation: "Upgrades the 'requests' package to the latest version.",
        type: "theory"
      },
      {
        title: "Uninstalling a Package",
        content: "Use pip uninstall to remove packages.",
        code: "pip uninstall requests",
        explanation: "Removes the 'requests' package from your environment.",
        type: "theory"
      },
      {
        question: "Which command installs a package in Python?",
        options: ["pip install package_name", "install package_name", "python package_name", "pip get package_name"],
        correctAnswer: 0,
        explanation: "The correct command to install a package is 'pip install package_name'.",
        type: "question"
      },
      {
        question: "How do you upgrade a Python package?",
        options: ["pip upgrade package_name", "pip install --upgrade package_name", "pip update package_name", "pip refresh package_name"],
        correctAnswer: 1,
        explanation: "Use 'pip install --upgrade package_name' to upgrade a package.",
        type: "question"
      }
    ]
  }
},

// ------------------- Python Try...Except -------------------
{
  id: "python-try-except",
  title: "Python Try...Except",
  description: "Learn how to handle errors in Python using try...except blocks.",
  difficulty: 'Advanced',
  baseXP: 350,
  baselineTime: 1.5,
  language: "python",
  category: "Error Handling",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Basic Try...Except",
        content: "Use try...except to handle exceptions.",
        code: "try:\n    x = 5 / 0\nexcept ZeroDivisionError:\n    print('Cannot divide by zero')",
        explanation: "The exception ZeroDivisionError is caught, preventing the program from crashing.",
        type: "theory"
      },
      {
        title: "Catching Multiple Exceptions",
        content: "Handle multiple exception types in one block.",
        code: "try:\n    x = int('abc')\nexcept (ValueError, TypeError):\n    print('Invalid input')",
        explanation: "Catches both ValueError and TypeError exceptions.",
        type: "theory"
      },
      {
        title: "Using Else with Try...Except",
        content: "Use else to run code if no exceptions occur.",
        code: "try:\n    x = 10 / 2\nexcept ZeroDivisionError:\n    print('Error')\nelse:\n    print('Division successful')",
        explanation: "The else block runs only if no exception is raised.",
        type: "theory"
      },
      {
        title: "Finally Block",
        content: "Use finally to execute code regardless of exceptions.",
        code: "try:\n    x = 1 / 1\nexcept ZeroDivisionError:\n    print('Error')\nfinally:\n    print('This always runs')",
        explanation: "The finally block executes whether an exception occurred or not.",
        type: "theory"
      },
      {
        question: "Which block runs no matter what, even if an exception occurs?",
        options: ["try", "except", "else", "finally"],
        correctAnswer: 3,
        explanation: "The finally block always runs regardless of exceptions.",
        type: "question"
      },
      {
        question: "How do you catch multiple exception types in Python?",
        options: ["except Type1, Type2:", "except (Type1, Type2):", "except Type1 | Type2:", "except Type1 & Type2:"],
        correctAnswer: 1,
        explanation: "Use parentheses: except (Type1, Type2): to catch multiple exception types.",
        type: "question"
      }
    ]
  }
},
// ------------------- Python String Formatting -------------------
{
  id: "python-string-formatting",
  title: "Python String Formatting",
  description: "Learn how to format strings in Python using different methods.",
  difficulty: 'Advanced',
  baseXP: 370,
  baselineTime: 1.5,
  language: "python",
  category: "Strings",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Using f-strings",
        content: "Insert variables directly into strings using f-strings.",
        code: "name = \"Alice\"\nage = 25\nprint(f\"Hello, {name}! You are {age} years old.\")  # Output: Hello, Alice! You are 25 years old.",
        explanation: "f-strings are an easy way to embed variables into strings.",
        type: "theory"
      },
      {
        title: "Using str.format()",
        content: "Format strings using the format() method.",
        code: "print(\"Hello, {}! You are {} years old.\".format(\"Bob\", 30))  # Output: Hello, Bob! You are 30 years old.",
        explanation: "The format() method replaces the {} placeholders with the given values.",
        type: "theory"
      },
      {
        title: "Number Formatting",
        content: "Format numbers with specific precision.",
        code: "pi = 3.14159\nprint(f\"Pi rounded to 2 decimals: {pi:.2f}\")  # Output: Pi rounded to 2 decimals: 3.14",
        explanation: "Use :.2f to round a floating number to 2 decimal places.",
        type: "theory"
      },
      {
        title: "Using % Operator",
        content: "Old-style string formatting using % operator.",
        code: "name = \"Charlie\"\nage = 28\nprint(\"Hello, %s! You are %d years old.\" % (name, age))  # Output: Hello, Charlie! You are 28 years old.",
        explanation: "The % operator can insert strings (%s) and integers (%d) into text.",
        type: "theory"
      },
      {
        question: "Which string formatting method uses {} placeholders?",
        options: ["f-strings", "str.format()", "Both", "% operator"],
        correctAnswer: 2,
        explanation: "Both f-strings and str.format() use {} placeholders for inserting values.",
        type: "question"
      },
      {
        question: "What will this print?\n\npi = 3.14159\nprint(f\"Pi: {pi:.1f}\")",
        options: ["Pi: 3", "Pi: 3.1", "Pi: 3.14", "Pi: 3.14159"],
        correctAnswer: 1,
        explanation: "The :.1f rounds the number to 1 decimal place, so the output is Pi: 3.1.",
        type: "question"
      }
    ]
  }
},


// ------------------- Python User Input -------------------
{
  id: "python-user-input",
  title: "Python User Input",
  description: "Learn how to take input from users in Python.",
  difficulty: 'Advanced',
  baseXP: 390,
  baselineTime: 1.5,
  language: "python",
  category: "Input/Output",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Using input()",
        content: "Take input from the user as a string.",
        code: "name = input(\"Enter your name: \")\nprint(\"Hello, \" + name + \"!\")\n# Output: Hello, Alice!  (if input was Alice)",
        explanation: "input() reads user input as a string.",
        type: "theory"
      },
      {
        title: "Converting Input to Integer",
        content: "Convert user input to an integer for calculations.",
        code: "age = int(input(\"Enter your age: \"))\nprint(\"Next year, you will be\", age + 1)\n# Output: Next year, you will be 26  (if input was 25)",
        explanation: "Use int() to convert string input into an integer.",
        type: "theory"
      },
      {
        title: "Using float Input",
        content: "Convert user input to a floating-point number.",
        code: "price = float(input(\"Enter price: \"))\ntotal = price * 1.2\nprint(\"Total with tax:\", total)\n# Output: Total with tax: 12.0  (if input was 10.0)",
        explanation: "Use float() to convert string input into a decimal number.",
        type: "theory"
      },
      {
        title: "Multiple Inputs in One Line",
        content: "Take multiple inputs separated by space.",
        code: "x, y = input(\"Enter two numbers: \").split()\nx = int(x)\ny = int(y)\nprint(\"Sum:\", x + y)\n# Output: Sum: 15  (if input was 7 8)",
        explanation: "split() divides input string into multiple values.",
        type: "theory"
      },
      {
        question: "What type does input() return by default?",
        options: ["int", "float", "str", "bool"],
        correctAnswer: 2,
        explanation: "input() always returns a string unless converted.",
        type: "question"
      },
      {
        question: "How can you take two numbers in one input line?",
        options: ["input().split()", "input(int)", "input(float)", "input().join()"],
        correctAnswer: 0,
        explanation: "Use split() to divide a single input string into multiple values.",
        type: "question"
      }
    ]
  }
},

// ------------------- Python Read Files -------------------
{
  id: "python-read-files",
  title: "Python Read Files",
  description: "Learn how to open and read files in Python.",
  difficulty: 'Advanced',
  baseXP: 410,
  baselineTime: 1.5,
  language: "python",
  category: "Files",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Read Entire File",
        content: "Read the full content of a file.",
        code: "file = open('example.txt', 'r')\ncontent = file.read()\nprint(content)\n# Output: Hello, world!  (if example.txt contains 'Hello, world!')\nfile.close()",
        explanation: "open() with 'r' mode reads the entire file content.",
        type: "theory"
      },
      {
        title: "Read Line by Line",
        content: "Read a file line by line using readline().",
        code: "file = open('example.txt', 'r')\nline = file.readline()\nprint(line)\n# Output: Hello, world!\\n  (reads the first line)\nfile.close()",
        explanation: "readline() reads one line at a time from the file.",
        type: "theory"
      },
      {
        title: "Read All Lines into List",
        content: "Read all lines into a list using readlines().",
        code: "file = open('example.txt', 'r')\nlines = file.readlines()\nprint(lines)\n# Output: ['Hello, world!\\n', 'Python is fun!\\n']\nfile.close()",
        explanation: "readlines() returns a list of all lines in the file.",
        type: "theory"
      },
      {
        title: "Using with Statement",
        content: "Automatically close file after reading.",
        code: "with open('example.txt', 'r') as file:\n    content = file.read()\n    print(content)\n# Output: Hello, world!\\nPython is fun!",
        explanation: "The with statement handles file closing automatically.",
        type: "theory"
      },
      {
        question: "Which method reads the file line by line?",
        options: ["read()", "readline()", "readlines()", "open()"],
        correctAnswer: 1,
        explanation: "readline() reads one line at a time.",
        type: "question"
      },
      {
        question: "What is the advantage of using 'with open()'?",
        options: ["Reads file faster", "Automatically closes the file", "Writes to the file", "Deletes the file"],
        correctAnswer: 1,
        explanation: "with automatically closes the file after the block ends.",
        type: "question"
      }
    ]
  }
},

// ------------------- Python Write/Create Files -------------------
{
  id: "python-write-files",
  title: "Python Write/Create Files",
  description: "Learn how to write and create files in Python.",
  difficulty: 'Advanced',
  baseXP: 430,
  baselineTime: 1.5,
  language: "python",
  category: "Files",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Write to a File",
        content: "Create a new file and write text to it.",
        code: "file = open('newfile.txt', 'w')\nfile.write('Hello Python!')\nfile.close()\nfile = open('newfile.txt', 'r')\nprint(file.read())\n# Output: Hello Python!\nfile.close()",
        explanation: "'w' mode creates a new file or overwrites an existing one.",
        type: "theory"
      },
      {
        title: "Append to a File",
        content: "Add content to an existing file without overwriting.",
        code: "file = open('newfile.txt', 'a')\nfile.write('\\nWelcome!')\nfile.close()\nfile = open('newfile.txt', 'r')\nprint(file.read())\n# Output: Hello Python!\n# Welcome!\nfile.close()",
        explanation: "'a' mode appends content to the end of the file.",
        type: "theory"
      },
      {
        title: "Using with Statement to Write",
        content: "Automatically manage file closing when writing.",
        code: "with open('newfile2.txt', 'w') as file:\n    file.write('Python is fun!')\nwith open('newfile2.txt', 'r') as file:\n    print(file.read())\n# Output: Python is fun!",
        explanation: "Using with ensures the file is closed automatically.",
        type: "theory"
      },
      {
        title: "Writing Multiple Lines",
        content: "Write multiple lines at once using writelines().",
        code: "lines = ['Line 1\\n', 'Line 2\\n', 'Line 3\\n']\nfile = open('multilines.txt', 'w')\nfile.writelines(lines)\nfile.close()\nfile = open('multilines.txt', 'r')\nprint(file.read())\n# Output: Line 1\n# Line 2\n# Line 3\nfile.close()",
        explanation: "writelines() writes a list of strings to the file.",
        type: "theory"
      },
      {
        question: "Which mode appends to an existing file?",
        options: ["r", "w", "a", "x"],
        correctAnswer: 2,
        explanation: "'a' mode appends content without overwriting.",
        type: "question"
      },
      {
        question: "What does writelines() do?",
        options: ["Reads multiple lines", "Writes multiple lines", "Deletes lines", "Closes the file"],
        correctAnswer: 1,
        explanation: "writelines() writes a list of strings to a file.",
        type: "question"
      }
    ]
  }
},

// ------------------- Python Delete Files -------------------
{
  id: "python-delete-files",
  title: "Python Delete Files",
  description: "Learn how to delete files in Python.",
  difficulty: 'Advanced',
  baseXP: 450,
  baselineTime: 1.5,
  language: "python",
  category: "Files",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Delete a File",
        content: "Remove a file using os.remove().",
        code: "import os\nos.remove('newfile.txt')\nprint('File deleted')\n# Output: File deleted",
        explanation: "os.remove() deletes the specified file from the system.",
        type: "theory"
      },
      {
        title: "Check Before Deleting",
        content: "Check if file exists before deleting to avoid errors.",
        code: "import os\nif os.path.exists('newfile2.txt'):\n    os.remove('newfile2.txt')\n    print('File deleted')\nelse:\n    print('File does not exist')\n# Output: File deleted  (if file exists)",
        explanation: "os.path.exists() helps safely delete a file only if it exists.",
        type: "theory"
      },
      {
        title: "Delete Multiple Files",
        content: "Loop through a list of files and delete each one.",
        code: "import os\nfiles = ['file1.txt', 'file2.txt']\nfor f in files:\n    if os.path.exists(f):\n        os.remove(f)\n        print(f'{f} deleted')\n# Output: file1.txt deleted\n# file2.txt deleted  (if files exist)",
        explanation: "Looping with os.remove() deletes multiple files safely.",
        type: "theory"
      },
      {
        title: "Using try...except for Safe Delete",
        content: "Catch errors if file does not exist.",
        code: "import os\ntry:\n    os.remove('nonexistent.txt')\n    print('File deleted')\nexcept FileNotFoundError:\n    print('File not found')\n# Output: File not found",
        explanation: "try...except prevents your program from crashing if the file does not exist.",
        type: "theory"
      },
      {
        question: "Which function deletes a file?",
        options: ["os.remove()", "os.delete()", "file.close()", "open()"],
        correctAnswer: 0,
        explanation: "os.remove() deletes a file from the system.",
        type: "question"
      },
      {
        question: "What happens if you try to delete a nonexistent file without try...except?",
        options: ["Nothing happens", "File is created", "FileNotFoundError occurs", "File is renamed"],
        correctAnswer: 2,
        explanation: "Deleting a nonexistent file without handling causes FileNotFoundError.",
        type: "question"
      }
    ]
  }
},


// ------------------- Python Modules & Libraries -------------------
{
  id: "python-modules-libraries",
  title: "Python Modules & Libraries",
  description: "Learn how to use modules and libraries in Python.",
  difficulty: "Advanced",
  baseXP: 470,
  baselineTime: 2,
  language: "python",
  category: "Modules",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Importing a Module",
        content: "Use import to bring a module into your program.",
        code: "import math\nprint(math.sqrt(16))\n# Output: 4.0",
        explanation: "import math allows you to access mathematical functions like sqrt().",
        type: "theory"
      },
      {
        title: "Import Specific Function",
        content: "Import only a specific function from a module.",
        code: "from math import pi\nprint(pi)\n# Output: 3.141592653589793",
        explanation: "from math import pi allows direct use of pi without math.pi.",
        type: "theory"
      },
      {
        title: "Using an Alias",
        content: "Give a module an alias using as.",
        code: "import numpy as np\narr = np.array([1,2,3])\nprint(arr)\n# Output: [1 2 3]",
        explanation: "Alias makes it easier to reference modules, e.g., np instead of numpy.",
        type: "theory"
      },
      {
        title: "Using pip Installed Libraries",
        content: "Install and import external libraries using pip.",
        code: "# pip install requests\nimport requests\nresponse = requests.get('https://api.github.com')\nprint(response.status_code)\n# Output: 200  (if request is successful)",
        explanation: "pip allows installing external libraries, which can then be imported and used.",
        type: "theory"
      },
      {
        question: "Which statement imports a module with an alias?",
        options: ["import math as m", "from math import sqrt", "import math.sqrt", "import math()"],
        correctAnswer: 0,
        explanation: "import math as m imports math with alias m.",
        type: "question"
      },
      {
        question: "How do you install external libraries in Python?",
        options: ["using import", "using pip", "using def", "using open()"],
        correctAnswer: 1,
        explanation: "pip installs external libraries that can be imported in Python.",
        type: "question"
      }
    ]
  }
},

// ------------------- Python Random Numbers -------------------
{
  id: "python-random-numbers",
  title: "Python Random Numbers",
  description: "Learn how to generate random numbers in Python using the random module.",
  difficulty: "Advanced",
  baseXP: 490,
  baselineTime: 2,
  language: "python",
  category: "Random",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Importing Random Module",
        content: "Use import random to access random functions.",
        code: "import random",
        explanation: "random module provides functions to generate random numbers and choices.",
        type: "theory"
      },
      {
        title: "Generating Random Integer",
        content: "Use randint(a, b) to get random integer between a and b inclusive.",
        code: "print(random.randint(1, 10))",
        explanation: "randint(1,10) generates a random number between 1 and 10 inclusive.",
        type: "theory"
      },
      {
        title: "Random Float Number",
        content: "Use random.random() to get a float between 0 and 1.",
        code: "print(random.random())",
        explanation: "random() returns a random float number between 0 and 1.",
        type: "theory"
      },
      {
        title: "Random Choice from List",
        content: "Use random.choice() to select a random element from a list.",
        code: "items = ['apple', 'banana', 'cherry']\nprint(random.choice(items))",
        explanation: "choice() randomly selects one item from a sequence.",
        type: "theory"
      },
      {
        question: "Which function returns a random float between 0 and 1?",
        options: ["random.randint()", "random.random()", "random.choice()", "random.uniform()"],
        correctAnswer: 1,
        explanation: "random.random() generates a float between 0 and 1.",
        type: "question"
      },
      {
        question: "How do you select a random item from a list?",
        options: ["random.randint(list)", "random.choice(list)", "random.list(list)", "list.random()"],
        correctAnswer: 1,
        explanation: "random.choice(list) selects a random element from a list.",
        type: "question"
      }
    ]
  }
},

// ------------------- NumPy Tutorial -------------------
{
  id: "numpy-tutorial",
  title: "NumPy Tutorial",
  description: "Learn the basics of NumPy, a library for numerical computing in Python.",
  difficulty: "Advanced",
  baseXP: 510,
  baselineTime: 2,
  language: "python",
  category: "NumPy",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Importing NumPy",
        content: "Import NumPy with an alias.",
        code: "import numpy as np\narr = np.array([1,2,3,4])\nprint(arr)\n# Output: [1 2 3 4]",
        explanation: "NumPy is imported as np, which is standard convention.",
        type: "theory"
      },
      {
        title: "Array Operations",
        content: "Perform element-wise operations on arrays.",
        code: "arr = np.array([1,2,3])\nprint(arr * 2)\n# Output: [2 4 6]",
        explanation: "Operations on NumPy arrays are applied element-wise.",
        type: "theory"
      },
      {
        title: "Array Shape and Dimensions",
        content: "Check the shape and number of dimensions of an array.",
        code: "arr2 = np.array([[1,2],[3,4]])\nprint(arr2.shape)\n# Output: (2, 2)\nprint(arr2.ndim)\n# Output: 2",
        explanation: "shape shows the array dimensions, ndim shows the number of dimensions.",
        type: "theory"
      },
      {
        title: "Array Functions",
        content: "Use NumPy functions like mean, sum, and max.",
        code: "arr = np.array([1,2,3,4,5])\nprint(np.mean(arr))\n# Output: 3.0\nprint(np.sum(arr))\n# Output: 15\nprint(np.max(arr))\n# Output: 5",
        explanation: "NumPy provides efficient functions for common array operations.",
        type: "theory"
      },
      {
        question: "How do you create a NumPy array?",
        options: ["np.list([1,2,3])", "np.array([1,2,3])", "array([1,2,3])", "list.array([1,2,3])"],
        correctAnswer: 1,
        explanation: "np.array([1,2,3]) creates a NumPy array from a Python list.",
        type: "question"
      },
      {
        question: "What does arr.ndim return?",
        options: ["Number of elements", "Number of dimensions", "Shape of array", "Data type of array"],
        correctAnswer: 1,
        explanation: "arr.ndim returns the number of dimensions of the array.",
        type: "question"
      }
    ]
  }
},
// ------------------- SciPy Tutorial 1: Basics & Linear Algebra -------------------
{
  id: "scipy-tutorial-1",
  title: "SciPy Basics & Linear Algebra",
  description: "Learn to use SciPy for basic operations and linear algebra functions.",
  difficulty: "Advanced",
  baseXP: 530,
  baselineTime: 2,
  language: "python",
  category: "SciPy",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Importing SciPy",
        content: "Import specific modules from SciPy.",
        code: "from scipy import linalg\nimport numpy as np\nprint(\"SciPy imported\")\n# Output: SciPy imported",
        explanation: "You can import only the parts of SciPy you need.",
        type: "theory"
      },
      {
        title: "Example 2: Creating a Matrix",
        content: "Create a 2x2 NumPy matrix for SciPy functions.",
        code: "matrix = np.array([[1, 2], [3, 4]])\nprint(matrix)\n# Output:\n# [[1 2]\n#  [3 4]]",
        explanation: "SciPy works on NumPy arrays for linear algebra operations.",
        type: "theory"
      },
      {
        title: "Example 3: Calculating Determinant",
        content: "Find the determinant of a matrix.",
        code: "det = linalg.det(matrix)\nprint(det)\n# Output: -2.0",
        explanation: "linalg.det() calculates the determinant of a square matrix.",
        type: "theory"
      },
      {
        title: "Example 4: Finding Inverse",
        content: "Compute the inverse of a matrix.",
        code: "inv = linalg.inv(matrix)\nprint(inv)\n# Output:\n# [[-2.   1. ]\n#  [ 1.5 -0.5]]",
        explanation: "linalg.inv() returns the inverse of a non-singular square matrix.",
        type: "theory"
      },
      {
        question: "Which function calculates the determinant of a matrix?",
        options: ["linalg.inv()", "linalg.det()", "np.sum()", "np.mean()"],
        correctAnswer: 1,
        explanation: "linalg.det() returns the determinant of a matrix.",
        type: "question"
      },
      {
        question: "What does linalg.inv(matrix) return?",
        options: ["The determinant", "The inverse", "The sum", "The transpose"],
        correctAnswer: 1,
        explanation: "linalg.inv(matrix) computes the inverse of the matrix.",
        type: "question"
      }
    ]
  }
},
// ------------------- SciPy Tutorial 2: Statistics & Optimization -------------------
{
  id: "scipy-tutorial-2",
  title: "SciPy Statistics & Optimization",
  description: "Learn basic statistics functions and optimization with SciPy.",
  difficulty: "Advanced",
  baseXP: 550,
  baselineTime: 2,
  language: "python",
  category: "SciPy",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Import Stats Module",
        content: "Import stats module from SciPy.",
        code: "from scipy import stats\nimport numpy as np\nprint(\"Stats module imported\")\n# Output: Stats module imported",
        explanation: "stats module contains functions for statistical analysis.",
        type: "theory"
      },
      {
        title: "Example 2: Calculating Mean and Median",
        content: "Use SciPy stats to calculate mean and median.",
        code: "data = np.array([1, 2, 3, 4, 5])\nprint(stats.tmean(data))\n# Output: 3.0\nprint(np.median(data))\n# Output: 3.0",
        explanation: "stats.tmean() calculates the trimmed mean (or mean), np.median() returns median.",
        type: "theory"
      },
      {
        title: "Example 3: Finding Mode",
        content: "Find the most frequent value in an array.",
        code: "mode_result = stats.mode(data)\nprint(mode_result)\n# Output: ModeResult(mode=array([1]), count=array([1]))",
        explanation: "stats.mode() returns the mode and its frequency count.",
        type: "theory"
      },
      {
        title: "Example 4: Optimization Example",
        content: "Use minimize to find the minimum of a function.",
        code: "from scipy.optimize import minimize\nfunc = lambda x: (x-3)**2\nres = minimize(func, 0)\nprint(res.x)\n# Output: [3.]",
        explanation: "minimize finds the input x that gives the lowest function value.",
        type: "theory"
      },
      {
        question: "Which SciPy function finds the mode of a dataset?",
        options: ["stats.mean()", "stats.mode()", "stats.median()", "np.sum()"],
        correctAnswer: 1,
        explanation: "stats.mode() returns the most frequent value in the data.",
        type: "question"
      },
      {
        question: "What does minimize(func, 0) do?",
        options: ["Finds the maximum of func", "Finds the minimum of func", "Calculates mean of func", "Calculates sum of func"],
        correctAnswer: 1,
        explanation: "minimize finds the value of x that gives the lowest function value.",
        type: "question"
      }
    ]
  }
},
// ------------------- Pandas Tutorial 1: Series & DataFrames -------------------
{
  id: "pandas-tutorial-1",
  title: "Pandas Series & DataFrames",
  description: "Learn how to create Pandas Series and DataFrames and access their data.",
  difficulty: "Advanced",
  baseXP: 570,
  baselineTime: 2,
  language: "python",
  category: "Pandas",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Creating a Series",
        content: "Create a simple Pandas Series from a list.",
        code: "import pandas as pd\nseries = pd.Series([10, 20, 30, 40])\nprint(series)\n# Output:\n# 0    10\n# 1    20\n# 2    30\n# 3    40\n# dtype: int64",
        explanation: "A Series is a one-dimensional labeled array.",
        type: "theory"
      },
      {
        title: "Example 2: Creating a DataFrame",
        content: "Create a DataFrame from a dictionary.",
        code: "data = {'Name': ['Alice', 'Bob'], 'Age': [25, 30]}\ndf = pd.DataFrame(data)\nprint(df)\n# Output:\n#    Name  Age\n# 0  Alice   25\n# 1    Bob   30",
        explanation: "A DataFrame is a 2-dimensional labeled data structure.",
        type: "theory"
      },
      {
        title: "Example 3: Accessing Columns",
        content: "Access a specific column of a DataFrame.",
        code: "print(df['Name'])\n# Output:\n# 0    Alice\n# 1      Bob\n# Name: Name, dtype: object",
        explanation: "Columns can be accessed using their names as keys.",
        type: "theory"
      },
      {
        title: "Example 4: Accessing Rows",
        content: "Access a specific row using loc or iloc.",
        code: "print(df.loc[0])\n# Output:\n# Name    Alice\n# Age        25\n# Name: 0, dtype: object",
        explanation: "loc accesses rows by label, iloc by index.",
        type: "theory"
      },
      {
        question: "How do you access a column 'Name' in a DataFrame df?",
        options: ["df.Name", "df['Name']", "df[0]", "Both 1 and 2"],
        correctAnswer: 3,
        explanation: "Both df['Name'] and df.Name access the column, but using brackets is safer.",
        type: "question"
      },
      {
        question: "Which function creates a DataFrame from a dictionary?",
        options: ["pd.Series()", "pd.DataFrame()", "pd.array()", "pd.Matrix()"],
        correctAnswer: 1,
        explanation: "pd.DataFrame() converts a dictionary or 2D data into a DataFrame.",
        type: "question"
      }
    ]
  }
},
// ------------------- Pandas Tutorial 2: Data Operations & Analysis -------------------
{
  id: "pandas-tutorial-2",
  title: "Pandas Data Operations & Analysis",
  description: "Learn basic operations like filtering, adding columns, and summarizing data.",
  difficulty: "Advanced",
  baseXP: 590,
  baselineTime: 2,
  language: "python",
  category: "Pandas",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Adding a Column",
        content: "Add a new column to a DataFrame.",
        code: "df['Country'] = ['USA', 'UK']\nprint(df)\n# Output:\n#    Name  Age Country\n# 0  Alice   25     USA\n# 1    Bob   30      UK",
        explanation: "You can assign a new list to create a new column.",
        type: "theory"
      },
      {
        title: "Example 2: Filtering Rows",
        content: "Filter rows based on a condition.",
        code: "filtered = df[df['Age'] > 25]\nprint(filtered)\n# Output:\n#   Name  Age Country\n# 1  Bob   30     UK",
        explanation: "Use boolean conditions to select specific rows.",
        type: "theory"
      },
      {
        title: "Example 3: Summary Statistics",
        content: "Use describe() to get statistics about numeric columns.",
        code: "print(df.describe())\n# Output:\n#              Age\n# count   2.000000\n# mean   27.500000\n# std     3.535534\n# min    25.000000\n# 25%    26.250000\n# 50%    27.500000\n# 75%    28.750000\n# max    30.000000",
        explanation: "describe() provides count, mean, std, min, max, and quartiles.",
        type: "theory"
      },
      {
        title: "Example 4: Sorting by Column",
        content: "Sort DataFrame by Age.",
        code: "print(df.sort_values('Age'))\n# Output:\n#    Name  Age Country\n# 0  Alice   25     USA\n# 1    Bob   30      UK",
        explanation: "sort_values() sorts the DataFrame by the specified column.",
        type: "theory"
      },
      {
        question: "How do you filter rows where Age > 25?",
        options: ["df['Age'] > 25", "df[df['Age'] > 25]", "df.loc[Age > 25]", "df.select('Age > 25')"],
        correctAnswer: 1,
        explanation: "df[df['Age'] > 25] returns rows where the condition is True.",
        type: "question"
      },
      {
        question: "Which function provides summary statistics of numeric columns?",
        options: ["df.summary()", "df.describe()", "df.stats()", "df.info()"],
        correctAnswer: 1,
        explanation: "df.describe() returns count, mean, std, min, max, and quartiles for numeric columns.",
        type: "question"
      }
    ]
  }
},
// ------------------- MongoDB Tutorial 1: Basics & CRUD Operations -------------------
{
  id: "mongodb-tutorial-1",
  title: "MongoDB Basics & CRUD",
  description: "Learn how to connect to MongoDB, create databases and collections, and perform basic CRUD operations.",
  difficulty: "Advanced",
  baseXP: 610,
  baselineTime: 2,
  language: "python",
  category: "MongoDB",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Connecting to MongoDB",
        content: "Connect to a local MongoDB server using pymongo.",
        code: "from pymongo import MongoClient\nclient = MongoClient('mongodb://localhost:27017/')\ndb = client['testdb']\nprint(db)\n# Output:\n# Database(MongoClient(host=['localhost:27017'], document_class=dict, tz_aware=False, connect=True), 'testdb')",
        explanation: "MongoClient connects to MongoDB; db selects a database.",
        type: "theory"
      },
      {
        title: "Example 2: Creating a Collection",
        content: "Create a collection named 'users'.",
        code: "collection = db['users']\nprint(collection)\n# Output:\n# Collection(Database(MongoClient(host=['localhost:27017'], document_class=dict, tz_aware=False, connect=True), 'testdb'), 'users')",
        explanation: "Collections are like tables in MongoDB.",
        type: "theory"
      },
      {
        title: "Example 3: Inserting Documents",
        content: "Insert a document (record) into the collection.",
        code: "user = {'name': 'Alice', 'age': 25}\nresult = collection.insert_one(user)\nprint(result.inserted_id)\n# Output:\n# ObjectId('64dfd8f5f5e3e7c8b9a12345')",
        explanation: "insert_one() adds a single document; inserted_id returns its unique ObjectId.",
        type: "theory"
      },
      {
        title: "Example 4: Finding Documents",
        content: "Retrieve documents from the collection.",
        code: "users = collection.find({'age': {'$gt': 20}})\nfor u in users:\n    print(u)\n# Output:\n# {'_id': ObjectId('64dfd8f5f5e3e7c8b9a12345'), 'name': 'Alice', 'age': 25}",
        explanation: "find() retrieves documents; conditions use MongoDB query operators like $gt (greater than).",
        type: "theory"
      },
      {
        question: "How do you create a collection named 'users' in MongoDB?",
        options: ["db.create('users')", "db['users']", "db.collection('users')", "db.new('users')"],
        correctAnswer: 1,
        explanation: "db['users'] either accesses or creates a collection named 'users'.",
        type: "question"
      },
      {
        question: "Which method inserts a single document into a collection?",
        options: ["insert()", "insert_one()", "add()", "save()"],
        correctAnswer: 1,
        explanation: "insert_one() adds one document; insert_many() can add multiple.",
        type: "question"
      }
    ]
  }
},
// ------------------- MongoDB Tutorial 2: Updating & Deleting Documents -------------------
{
  id: "mongodb-tutorial-2",
  title: "MongoDB Updating & Deleting",
  description: "Learn how to update and delete documents in a MongoDB collection.",
  difficulty: "Advanced",
  baseXP: 630,
  baselineTime: 2,
  language: "python",
  category: "MongoDB",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Updating a Document",
        content: "Update Alice's age to 26.",
        code: "collection.update_one({'name': 'Alice'}, {'$set': {'age': 26}})\nuser = collection.find_one({'name': 'Alice'})\nprint(user)\n# Output:\n# {'_id': ObjectId('64dfd8f5f5e3e7c8b9a12345'), 'name': 'Alice', 'age': 26}",
        explanation: "update_one() modifies the first matching document; $set changes only the specified fields.",
        type: "theory"
      },
      {
        title: "Example 2: Updating Multiple Documents",
        content: "Increase age by 1 for all users older than 25.",
        code: "collection.update_many({'age': {'$gt': 25}}, {'$inc': {'age': 1}})\nfor u in collection.find():\n    print(u)\n# Output:\n# {'_id': ObjectId('...'), 'name': 'Alice', 'age': 26}\n# {'_id': ObjectId('...'), 'name': 'Bob', 'age': 31}",
        explanation: "$inc increments a numeric field; update_many updates all matching documents.",
        type: "theory"
      },
      {
        title: "Example 3: Deleting a Document",
        content: "Delete Bob from the collection.",
        code: "collection.delete_one({'name': 'Bob'})\nfor u in collection.find():\n    print(u)\n# Output:\n# {'_id': ObjectId('64dfd8f5f5e3e7c8b9a12345'), 'name': 'Alice', 'age': 26}",
        explanation: "delete_one() removes the first matching document.",
        type: "theory"
      },
      {
        title: "Example 4: Deleting Multiple Documents",
        content: "Delete all users older than 25.",
        code: "collection.delete_many({'age': {'$gt': 25}})\nprint(list(collection.find()))\n# Output:\n# []",
        explanation: "delete_many() removes all matching documents; list() converts the cursor to a list for printing.",
        type: "theory"
      },
      {
        question: "Which operator is used to increment a numeric field in MongoDB?",
        options: ["$set", "$inc", "$add", "$update"],
        correctAnswer: 1,
        explanation: "$inc increases the value of a numeric field by the specified amount.",
        type: "question"
      },
      {
        question: "How do you delete multiple documents matching a condition?",
        options: ["delete()", "delete_one()", "delete_many()", "remove()"],
        correctAnswer: 2,
        explanation: "delete_many() removes all documents that match the query condition.",
        type: "question"
      }
    ]
  }
}
];

export const javascriptLessons: Lesson[] = [
  {
  id: "javascript-introduction-1",
  title: "JavaScript Introduction",
  description: "Get started with JavaScript and learn how it makes web pages dynamic.",
  difficulty: "Beginner",
  baseXP: 50,
  baselineTime: 1,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: A Simple Alert",
        content: "Show a popup message using JavaScript.",
        code: "<!DOCTYPE html>\n<html>\n<body>\n  <script>\n    alert('Welcome to JavaScript!');\n  </script>\n</body>\n</html>",
        explanation: "alert() displays a simple popup box with a message.",
        type: "theory"
      },
      {
        title: "Example 2: Writing to the Web Page",
        content: "Use document.write() to display text inside the page.",
        code: "<!DOCTYPE html>\n<html>\n<body>\n  <script>\n    document.write('Hello, this is JavaScript in action!');\n  </script>\n</body>\n</html>",
        explanation: "document.write() outputs text directly into the webpage.",
        type: "theory"
      },
      {
        title: "Example 3: Logging to the Console",
        content: "Print messages to the browser console for debugging.",
        code: "<!DOCTYPE html>\n<html>\n<body>\n  <script>\n    console.log('Learning JavaScript step by step');\n    // Output:\n    // Learning JavaScript step by step\n  </script>\n</body>\n</html>",
        explanation: "console.log() writes information to the developer console (F12 → Console).",
        type: "theory"
      },
      {
        title: "Example 4: Changing Page Content",
        content: "Use JavaScript to change text inside an HTML element.",
        code: "<!DOCTYPE html>\n<html>\n<body>\n  <p id=\"demo\">Original Text</p>\n  <script>\n    document.getElementById('demo').innerHTML = 'Text changed by JavaScript!';\n  </script>\n</body>\n</html>",
        explanation: "document.getElementById().innerHTML allows JavaScript to modify HTML content dynamically.",
        type: "theory"
      },
      {
        question: "Which function is used to show a popup alert box in JavaScript?",
        options: ["alert()", "console.log()", "document.write()", "popup()"],
        correctAnswer: 0,
        explanation: "The alert() function creates a popup box with a message.",
        type: "question"
      },
      {
        question: "How can JavaScript change the text of an HTML element?",
        options: ["console.log()", "innerHTML", "document.write()", "alert()"],
        correctAnswer: 1,
        explanation: "innerHTML is used to change the content of an HTML element selected by its ID.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-where-to-1",
  title: "JavaScript Where To",
  description: "Learn where to place JavaScript in an HTML document.",
  difficulty: "Beginner",
  baseXP: 55,
  baselineTime: 1,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: JavaScript Inside <body>",
        content: "Place JavaScript inside the body to run after the page loads.",
        code: "<!DOCTYPE html>\n<html>\n<body>\n  <h2>JavaScript in Body</h2>\n  <script>\n    document.write('This script runs from the body.');\n  </script>\n</body>\n</html>",
        explanation: "Scripts inside the <body> run when the browser reaches them while loading the page.",
        type: "theory"
      },
      {
        title: "Example 2: JavaScript Inside <head>",
        content: "Place JavaScript inside the head section.",
        code: "<!DOCTYPE html>\n<html>\n<head>\n  <script>\n    console.log('Script inside head runs before the body loads');\n    // Output:\n    // Script inside head runs before the body loads\n  </script>\n</head>\n<body>\n  <h2>Content Loads After Script</h2>\n</body>\n</html>",
        explanation: "Scripts in the <head> run before the body content is displayed unless deferred.",
        type: "theory"
      },
      {
        title: "Example 3: External JavaScript File",
        content: "Use the src attribute to load an external JavaScript file.",
        code: "<!DOCTYPE html>\n<html>\n<body>\n  <h2>External JS Example</h2>\n  <script src=\"app.js\"></script>\n</body>\n</html>\n\n/* app.js file */\nconsole.log('External JS file loaded');\n// Output:\n// External JS file loaded",
        explanation: "Using src makes your code reusable and keeps HTML cleaner.",
        type: "theory"
      },
      {
        title: "Example 4: Using defer Attribute",
        content: "Defer tells the browser to load the script after parsing HTML.",
        code: "<!DOCTYPE html>\n<html>\n<head>\n  <script src=\"defer-example.js\" defer></script>\n</head>\n<body>\n  <h2>Page Content</h2>\n</body>\n</html>\n\n/* defer-example.js file */\nconsole.log('Script executed after HTML parsing');\n// Output:\n// Script executed after HTML parsing",
        explanation: "defer ensures the script runs after the page is parsed, avoiding blocking.",
        type: "theory"
      },
      {
        question: "Which attribute ensures a script runs after the HTML document has been fully parsed?",
        options: ["async", "defer", "src", "run-late"],
        correctAnswer: 1,
        explanation: "The defer attribute delays script execution until after HTML parsing.",
        type: "question"
      },
      {
        question: "How do you include an external JavaScript file?",
        options: ["<script>file.js</script>", "<js src='file.js'>", "<script src='file.js'></script>", "<link src='file.js'>"],
        correctAnswer: 2,
        explanation: "External scripts are added with <script src='file.js'></script>.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-output-1",
  title: "JavaScript Output",
  description: "Learn the different ways to display output in JavaScript.",
  difficulty: "Beginner",
  baseXP: 60,
  baselineTime: 1,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Using alert()",
        content: "Show output in a popup alert box.",
        code: "<!DOCTYPE html>\n<html>\n<body>\n  <script>\n    alert('Hello from JavaScript!');\n  </script>\n</body>\n</html>",
        explanation: "alert() is often used for quick testing and shows a popup dialog box.",
        type: "theory"
      },
      {
        title: "Example 2: Writing to the HTML Page",
        content: "Use document.write() to display text inside the page.",
        code: "<!DOCTYPE html>\n<html>\n<body>\n  <script>\n    document.write('This text is written directly into the page.');\n  </script>\n</body>\n</html>",
        explanation: "document.write() inserts text into the HTML page. Not recommended for modern web apps.",
        type: "theory"
      },
      {
        title: "Example 3: Using innerHTML",
        content: "Change the content of an HTML element with innerHTML.",
        code: "<!DOCTYPE html>\n<html>\n<body>\n  <p id=\"demo\">Original content</p>\n  <script>\n    document.getElementById('demo').innerHTML = 'Content updated by JavaScript!';\n  </script>\n</body>\n</html>",
        explanation: "innerHTML replaces the content of the element with the given ID.",
        type: "theory"
      },
      {
        title: "Example 4: Using console.log()",
        content: "Print messages to the browser’s console for debugging.",
        code: "<!DOCTYPE html>\n<html>\n<body>\n  <script>\n    console.log('JavaScript is running');\n    console.log(10 + 5);\n    // Output:\n    // JavaScript is running\n    // 15\n  </script>\n</body>\n</html>",
        explanation: "console.log() is the most common way to test and debug code in the console.",
        type: "theory"
      },
      {
        question: "Which method is most commonly used for debugging values in JavaScript?",
        options: ["alert()", "document.write()", "innerHTML", "console.log()"],
        correctAnswer: 3,
        explanation: "console.log() is the best option for debugging because it prints messages to the console.",
        type: "question"
      },
      {
        question: "Which method would you use to replace the text inside an HTML element?",
        options: ["console.log()", "document.write()", "innerHTML", "alert()"],
        correctAnswer: 2,
        explanation: "innerHTML updates the content of an element selected by its ID.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-syntax-1",
  title: "JavaScript Syntax",
  description: "Understand the basic rules of JavaScript syntax such as statements, semicolons, and case sensitivity.",
  difficulty: "Beginner",
  baseXP: 65,
  baselineTime: 1,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: JavaScript Statements",
        content: "A JavaScript program is made of statements that end with semicolons.",
        code: "<!DOCTYPE html>\n<html>\n<body>\n  <script>\n    let x = 5;\n    let y = 10;\n    let sum = x + y;\n    console.log(sum);\n    // Output:\n    // 15\n  </script>\n</body>\n</html>",
        explanation: "Each instruction (statement) is usually written on a new line and ends with a semicolon.",
        type: "theory"
      },
      {
        title: "Example 2: Case Sensitivity",
        content: "JavaScript is case sensitive.",
        code: "<!DOCTYPE html>\n<html>\n<body>\n  <script>\n    let name = 'Alice';\n    console.log(name);\n    // Output:\n    // Alice\n\n    // console.log(Name); // Would cause an error because 'Name' ≠ 'name'\n  </script>\n</body>\n</html>",
        explanation: "Variables and function names are case sensitive in JavaScript (name and Name are different).",
        type: "theory"
      },
      {
        title: "Example 3: Whitespace",
        content: "JavaScript ignores extra spaces.",
        code: "<!DOCTYPE html>\n<html>\n<body>\n  <script>\n    let a=2;\n    let b      =     3;\n    console.log(a + b);\n    // Output:\n    // 5\n  </script>\n</body>\n</html>",
        explanation: "You can use extra spaces or line breaks to make your code more readable.",
        type: "theory"
      },
      {
        title: "Example 4: Comments",
        content: "Add comments to explain your code.",
        code: "<!DOCTYPE html>\n<html>\n<body>\n  <script>\n    // This is a single-line comment\n    let num = 7; // store number\n\n    /*\n       This is a\n       multi-line comment\n    */\n\n    console.log(num);\n    // Output:\n    // 7\n  </script>\n</body>\n</html>",
        explanation: "Use // for single-line comments and /* */ for multi-line comments.",
        type: "theory"
      },
      {
        question: "Which of the following is TRUE about JavaScript syntax?",
        options: ["It is not case sensitive", "Each statement must end with a semicolon", "Whitespace matters for execution", "It is case sensitive"],
        correctAnswer: 3,
        explanation: "JavaScript is case sensitive, meaning myVar and Myvar are different variables.",
        type: "question"
      },
     {
  question: "What will the following code output?\n\nlet x = 5;\nlet y = 10;\nlet sum = x + y;\nconsole.log(sum);",
  options: ["5", "10", "15", "510"],
  correctAnswer: 2,
  explanation: "The + operator adds the two numbers: 5 + 10 = 15.",
  type: "question"
}
    ]
  }
},
{
  id: "javascript-comments-1",
  title: "JavaScript Comments",
  description: "Learn how to use single-line and multi-line comments in JavaScript.",
  difficulty: "Beginner",
  baseXP: 70,
  baselineTime: 1,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Single-Line Comment",
        content: "Use // to create a single-line comment.",
        code: "<!DOCTYPE html>\n<html>\n<body>\n  <script>\n    // This is a single-line comment\n    console.log('Hello World');\n    // Output:\n    // Hello World\n  </script>\n</body>\n</html>",
        explanation: "// makes the rest of the line ignored by JavaScript.",
        type: "theory"
      },
      {
        title: "Example 2: Inline Comment",
        content: "Place a comment after code on the same line.",
        code: "<!DOCTYPE html>\n<html>\n<body>\n  <script>\n    let x = 10; // store number in x\n    console.log(x);\n    // Output:\n    // 10\n  </script>\n</body>\n</html>",
        explanation: "You can place // after code, and everything after it is ignored.",
        type: "theory"
      },
      {
        title: "Example 3: Multi-Line Comment",
        content: "Use /* */ to write multi-line comments.",
        code: "<!DOCTYPE html>\n<html>\n<body>\n  <script>\n    /*\n      This is a multi-line comment.\n      You can write across several lines.\n    */\n    console.log('Multi-line comment example');\n    // Output:\n    // Multi-line comment example\n  </script>\n</body>\n</html>",
        explanation: "Multi-line comments start with /* and end with */.",
        type: "theory"
      },
      {
        title: "Example 4: Commenting Out Code",
        content: "You can temporarily disable code using comments.",
        code: "<!DOCTYPE html>\n<html>\n<body>\n  <script>\n    // console.log('This line will not run');\n    console.log('Only this line runs');\n    // Output:\n    // Only this line runs\n  </script>\n</body>\n</html>",
        explanation: "Commenting code is useful for debugging or testing different parts of a program.",
        type: "theory"
      },
      {
        question: "Which symbols are used to start a single-line comment in JavaScript?",
        options: ["//", "/*", "#", "<!-- -->"],
        correctAnswer: 0,
        explanation: "// is used for single-line comments.",
        type: "question"
      },
      {
        question: "Why are comments useful in JavaScript?",
        options: ["They speed up code execution", "They explain code without affecting execution", "They change variable values", "They are required in every program"],
        correctAnswer: 1,
        explanation: "Comments are ignored by the interpreter and are used to explain the code.",
        type: "question"
      }
    ]
  }
},

{
  id: "javascript-let-1",
  title: "JavaScript Let",
  description: "Understand how let works for block-scoped variables.",
  difficulty: "Beginner",
  baseXP: 75,
  baselineTime: 1,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declaring with let",
        content: "Use let to declare variables.",
        code: "<script>\nlet x = 10;\nconsole.log(x);\n// Output:\n// 10\n</script>",
        explanation: "let is used to declare block-scoped variables.",
        type: "theory"
      },
      {
        title: "Example 2: Reassigning let Variables",
        content: "let allows reassignment.",
        code: "<script>\nlet y = 5;\nconsole.log(y);\ny = 15;\nconsole.log(y);\n// Output:\n// 5\n// 15\n</script>",
        explanation: "You can change the value of let variables.",
        type: "theory"
      },
      {
        title: "Example 3: Block Scope",
        content: "let is limited to the block where it’s declared.",
        code: "<script>\n{\n  let z = 20;\n  console.log(z);\n  // Output:\n  // 20\n}\n// console.log(z); // Error: z is not defined\n</script>",
        explanation: "let variables are only accessible within the block they are declared.",
        type: "theory"
      },
      {
        title: "Example 4: No Redeclaration",
        content: "You cannot redeclare the same variable with let in the same scope.",
        code: "<script>\nlet a = 30;\n// let a = 40; // Error: Identifier 'a' has already been declared\n</script>",
        explanation: "let prevents accidental redeclaration of the same variable.",
        type: "theory"
      },
      {
        question: "Can you redeclare a let variable in the same scope?",
        options: ["Yes", "No", "Only inside functions", "Only with const"],
        correctAnswer: 1,
        explanation: "You cannot redeclare a let variable in the same scope.",
        type: "question"
      },
      {
  question: "What will the following code output?\n\nlet x = 10;\nconsole.log(x);",
  options: ["10", "undefined", "Error", "0"],
  correctAnswer: 0,
  explanation: "The variable x is declared with let and assigned 10, so console.log(x) prints 10.",
  type: "question"
}
    ]
  }
  },

{
  id: "javascript-const-1",
  title: "JavaScript Const",
  description: "Learn how to declare constants in JavaScript with const.",
  difficulty: "Beginner",
  baseXP: 80,
  baselineTime: 1,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declaring with const",
        content: "Use const to declare a constant value.",
        code: "<script>\nconst pi = 3.1416;\nconsole.log(pi);\n// Output:\n// 3.1416\n</script>",
        explanation: "const is used for values that should not be reassigned.",
        type: "theory"
      },
      {
        title: "Example 2: No Reassignment",
        content: "const variables cannot be reassigned.",
        code: "<script>\nconst country = 'USA';\n// country = 'UK'; // Error: Assignment to constant variable.\n</script>",
        explanation: "Trying to reassign a const variable will throw an error.",
        type: "theory"
      },
      {
        title: "Example 3: Const with Objects",
        content: "You can change properties of a const object.",
        code: "<script>\nconst person = {name: 'Alice', age: 25};\nperson.age = 26;\nconsole.log(person);\n// Output:\n// {name: 'Alice', age: 26}\n</script>",
        explanation: "The object reference is constant, but its properties can be changed.",
        type: "theory"
      },
      {
        title: "Example 4: Block Scope with const",
        content: "const is block-scoped like let.",
        code: "<script>\n{\n  const color = 'blue';\n  console.log(color);\n  // Output:\n  // blue\n}\n// console.log(color); // Error: not defined\n</script>",
        explanation: "const variables are only accessible within the block they are declared.",
        type: "theory"
      },
      {
        question: "What happens if you try to reassign a const variable?",
        options: ["It updates normally", "It throws an error", "It creates a new variable", "It ignores the assignment"],
        correctAnswer: 1,
        explanation: "const variables cannot be reassigned.",
        type: "question"
      },
      {
        question: "Can you change properties of a const object?",
        options: ["Yes", "No", "Only numbers", "Only strings"],
        correctAnswer: 0,
        explanation: "You cannot reassign the object, but you can change its properties.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-variables-1",
  title: "JavaScript Variables",
  description: "Learn how to declare and use variables in JavaScript.",
  difficulty: "Beginner",
  baseXP: 85,
  baselineTime: 1,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declaring a Variable with var",
        content: "Use var to declare a variable.",
        code: "<script>\nvar name = 'Alice';\nconsole.log(name);\n// Output:\n// Alice\n</script>",
        explanation: "The var keyword declares a variable, but it has function scope (not recommended in modern code).",
        type: "theory"
      },
      {
        title: "Example 2: Declaring a Variable with let",
        content: "Use let to declare a block-scoped variable.",
        code: "<script>\nlet age = 25;\nconsole.log(age);\n// Output:\n// 25\n</script>",
        explanation: "let is block-scoped and preferred over var.",
        type: "theory"
      },
      {
        title: "Example 3: Declaring a Constant with const",
        content: "Use const for values that should not change.",
        code: "<script>\nconst pi = 3.14;\nconsole.log(pi);\n// Output:\n// 3.14\n</script>",
        explanation: "const declares a constant that cannot be reassigned.",
        type: "theory"
      },
      {
        title: "Example 4: Reassigning Variables",
        content: "Variables declared with var or let can be reassigned.",
        code: "<script>\nlet city = 'Paris';\nconsole.log(city);\ncity = 'London';\nconsole.log(city);\n// Output:\n// Paris\n// London\n</script>",
        explanation: "You can update values stored in let or var, but not const.",
        type: "theory"
      },
      {
        question: "Which keyword is recommended for block-scoped variables?",
        options: ["var", "let", "const", "define"],
        correctAnswer: 1,
        explanation: "let is used for block-scoped variables that may change.",
        type: "question"
      },
      {
        question: "What happens if you try to reassign a const variable?",
        options: ["It updates the value", "It throws an error", "It is ignored", "It creates a new variable"],
        correctAnswer: 1,
        explanation: "const variables cannot be reassigned; doing so throws an error.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-datatypes-1",
  title: "JavaScript Data Types",
  description: "Learn about the different data types in JavaScript.",
  difficulty: "Beginner",
  baseXP: 90,
  baselineTime: 1,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: String",
        content: "Strings represent text in JavaScript.",
        code: "<script>\nlet name = 'Alice';\nconsole.log(name);\n// Output:\n// Alice\n</script>",
        explanation: "A string is a sequence of characters enclosed in single or double quotes.",
        type: "theory"
      },
      {
        title: "Example 2: Number",
        content: "Numbers represent numeric values.",
        code: "<script>\nlet age = 25;\nconsole.log(age);\n// Output:\n// 25\n</script>",
        explanation: "JavaScript has a single Number type for both integers and decimals.",
        type: "theory"
      },
      {
        title: "Example 3: Boolean",
        content: "Boolean values can be true or false.",
        code: "<script>\nlet isStudent = true;\nconsole.log(isStudent);\n// Output:\n// true\n</script>",
        explanation: "Booleans are used for conditional logic.",
        type: "theory"
      },
      {
        title: "Example 4: Null and Undefined",
        content: "Null represents no value, undefined represents an uninitialized variable.",
        code: "<script>\nlet data = null;\nlet info;\nconsole.log(data);\nconsole.log(info);\n// Output:\n// null\n// undefined\n</script>",
        explanation: "Null is an assigned absence of value, undefined means the variable has not been assigned yet.",
        type: "theory"
      },
      {
        question: "Which data type represents true/false values?",
        options: ["String", "Number", "Boolean", "Null"],
        correctAnswer: 2,
        explanation: "Boolean values are true or false.",
        type: "question"
      },
      {
        question: "What is the value of an uninitialized variable?",
        options: ["null", "0", "undefined", "''"],
        correctAnswer: 2,
        explanation: "Uninitialized variables are undefined in JavaScript.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-operators-1",
  title: "JavaScript Operators",
  description: "Learn about different operators in JavaScript for performing operations on values.",
  difficulty: "Beginner",
  baseXP: 95,
  baselineTime: 1,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Arithmetic Operators",
        content: "Use arithmetic operators to perform math operations.",
        code: "<script>\nlet a = 10;\nlet b = 5;\nconsole.log(a + b);\nconsole.log(a - b);\nconsole.log(a * b);\nconsole.log(a / b);\n// Output:\n// 15\n// 5\n// 50\n// 2\n</script>",
        explanation: "Operators +, -, *, / are used for addition, subtraction, multiplication, and division.",
        type: "theory"
      },
      {
        title: "Example 2: Assignment Operators",
        content: "Assignment operators assign values to variables.",
        code: "<script>\nlet x = 10;\nx += 5; // same as x = x + 5\nconsole.log(x);\n// Output:\n// 15\n</script>",
        explanation: "+= adds a value to the variable and assigns it back.",
        type: "theory"
      },
      {
        title: "Example 3: Comparison Operators",
        content: "Compare values using comparison operators.",
        code: "<script>\nlet y = 10;\nconsole.log(y == 10);\nconsole.log(y === '10');\nconsole.log(y != 5);\nconsole.log(y > 5);\n// Output:\n// true\n// false\n// true\n// true\n</script>",
        explanation: "== checks value, === checks value and type, != checks inequality, > checks greater than.",
        type: "theory"
      },
      {
        title: "Example 4: Logical Operators",
        content: "Combine conditions using logical operators.",
        code: "<script>\nlet p = true;\nlet q = false;\nconsole.log(p && q);\nconsole.log(p || q);\nconsole.log(!p);\n// Output:\n// false\n// true\n// false\n</script>",
        explanation: "&& is AND, || is OR, ! is NOT.",
        type: "theory"
      },
      {
        question: "Which operator checks both value and type equality?",
        options: ["==", "===", "!=", ">"],
        correctAnswer: 1,
        explanation: "=== checks both the value and type of operands.",
        type: "question"
      },
      {
        question: "What is the result of true && false?",
        options: ["true", "false", "undefined", "null"],
        correctAnswer: 1,
        explanation: "Logical AND returns true only if both operands are true.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-arithmetic-1",
  title: "JavaScript Arithmetic",
  description: "Learn how to perform arithmetic operations in JavaScript.",
  difficulty: "Beginner",
  baseXP: 100,
  baselineTime: 1,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Addition and Subtraction",
        content: "Perform basic addition and subtraction.",
        code: "<script>\nlet a = 8;\nlet b = 3;\nconsole.log(a + b);\nconsole.log(a - b);\n// Output:\n// 11\n// 5\n</script>",
        explanation: "+ adds numbers, - subtracts numbers.",
        type: "theory"
      },
      {
        title: "Example 2: Multiplication and Division",
        content: "Multiply and divide numbers.",
        code: "<script>\nlet x = 6;\nlet y = 2;\nconsole.log(x * y);\nconsole.log(x / y);\n// Output:\n// 12\n// 3\n</script>",
        explanation: "* multiplies numbers, / divides numbers.",
        type: "theory"
      },
      {
        title: "Example 3: Modulus",
        content: "Get the remainder of a division using modulus.",
        code: "<script>\nlet num = 10;\nconsole.log(num % 3);\n// Output:\n// 1\n</script>",
        explanation: "% returns the remainder after division.",
        type: "theory"
      },
      {
        title: "Example 4: Increment and Decrement",
        content: "Increase or decrease numbers by 1.",
        code: "<script>\nlet counter = 5;\ncounter++;\nconsole.log(counter);\ncounter--;\nconsole.log(counter);\n// Output:\n// 6\n// 5\n</script>",
        explanation: "++ increments a number by 1, -- decrements a number by 1.",
        type: "theory"
      },
      {
        question: "What does 10 % 4 return?",
        options: ["2", "3", "4", "1"],
        correctAnswer: 0,
        explanation: "10 divided by 4 leaves a remainder of 2.",
        type: "question"
      },
      {
        question: "What is the value of counter after counter++ if it was 7?",
        options: ["6", "7", "8", "9"],
        correctAnswer: 2,
        explanation: "counter++ increases the value by 1 after current value is used.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-assignment-1",
  title: "JavaScript Assignment Operators",
  description: "Learn how to assign values to variables and use shorthand operators in JavaScript.",
  difficulty: "Beginner",
  baseXP: 105,
  baselineTime: 1,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic Assignment",
        content: "Assign a value to a variable using =.",
        code: "<script>\nlet a = 10;\nconsole.log(a);\n// Output:\n// 10\n</script>",
        explanation: "= assigns the value on the right to the variable on the left.",
        type: "theory"
      },
      {
        title: "Example 2: Add and Assign (+=)",
        content: "Add a value to a variable and assign the result.",
        code: "<script>\nlet b = 5;\nb += 3; // same as b = b + 3\nconsole.log(b);\n// Output:\n// 8\n</script>",
        explanation: "+= adds the right value to the variable and updates it.",
        type: "theory"
      },
      {
        title: "Example 3: Subtract and Assign (-=)",
        content: "Subtract a value from a variable and assign the result.",
        code: "<script>\nlet c = 10;\nc -= 4; // same as c = c - 4\nconsole.log(c);\n// Output:\n// 6\n</script>",
        explanation: "-= subtracts the right value from the variable and updates it.",
        type: "theory"
      },
      {
        title: "Example 4: Multiply and Assign (*=) / Divide and Assign (/=)",
        content: "Multiply or divide a variable and assign the result.",
        code: "<script>\nlet d = 6;\nd *= 2; // multiply and assign\nconsole.log(d);\nd /= 3; // divide and assign\nconsole.log(d);\n// Output:\n// 12\n// 4\n</script>",
        explanation: "*= multiplies, /= divides the variable by the right value and updates it.",
        type: "theory"
      },
      {
        question: "What does x += 5 do?",
        options: ["Subtracts 5 from x", "Adds 5 to x", "Multiplies x by 5", "Divides x by 5"],
        correctAnswer: 1,
        explanation: "+= adds the value on the right to the variable.",
        type: "question"
      },
      {
        question: "What is the result of d after d *= 3 if d was 4?",
        options: ["7", "12", "1", "3"],
        correctAnswer: 1,
        explanation: "*= multiplies the variable by 3, so 4 * 3 = 12.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-comparisons-1",
  title: "JavaScript Comparisons",
  description: "Learn how to compare values using comparison operators.",
  difficulty: "Beginner",
  baseXP: 110,
  baselineTime: 1,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Equal to (==)",
        content: "Check if two values are equal (type coercion allowed).",
        code: "<script>\nlet a = 5;\nlet b = '5';\nconsole.log(a == b);\n// Output:\n// true\n</script>",
        explanation: "== compares values but ignores type differences.",
        type: "theory"
      },
      {
        title: "Example 2: Strict Equal (===)",
        content: "Check if two values are equal and of the same type.",
        code: "<script>\nlet a = 5;\nlet b = '5';\nconsole.log(a === b);\n// Output:\n// false\n</script>",
        explanation: "=== compares both value and type.",
        type: "theory"
      },
      {
        title: "Example 3: Not Equal (!=)",
        content: "Check if two values are not equal.",
        code: "<script>\nlet x = 10;\nlet y = 20;\nconsole.log(x != y);\n// Output:\n// true\n</script>",
        explanation: "!= returns true if values are different (ignores type).",
        type: "theory"
      },
      {
        title: "Example 4: Greater Than and Less Than",
        content: "Compare numbers using > and < operators.",
        code: "<script>\nconsole.log(10 > 5);\n// Output:\n// true\nconsole.log(3 < 2);\n// Output:\n// false\n</script>",
        explanation: "You can compare numeric values with >, <, >=, and <=.",
        type: "theory"
      },
      {
        question: "What does 5 == '5' return?",
        options: ["true", "false", "Error", "undefined"],
        correctAnswer: 0,
        explanation: "== checks value only, so 5 == '5' is true.",
        type: "question"
      },
      {
        question: "What will 10 > 20 return?",
        options: ["true", "false", "undefined", "Error"],
        correctAnswer: 1,
        explanation: "10 is not greater than 20, so it returns false.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-if-else-1",
  title: "JavaScript If...Else",
  description: "Use if...else to execute code conditionally based on true or false expressions.",
  difficulty: "Beginner",
  baseXP: 115,
  baselineTime: 1,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic If",
        content: "Run code only if a condition is true.",
        code: "<script>\nlet age = 18;\nif(age >= 18) {\n  console.log('You are an adult');\n}\n// Output:\n// You are an adult\n</script>",
        explanation: "if executes the block only when the condition evaluates to true.",
        type: "theory"
      },
      {
        title: "Example 2: If...Else",
        content: "Run one block if true, another if false.",
        code: "<script>\nlet age = 16;\nif(age >= 18) {\n  console.log('You are an adult');\n} else {\n  console.log('You are a minor');\n}\n// Output:\n// You are a minor\n</script>",
        explanation: "else provides an alternative when the if condition is false.",
        type: "theory"
      },
      {
        title: "Example 3: If...Else If...Else",
        content: "Check multiple conditions sequentially.",
        code: "<script>\nlet score = 75;\nif(score >= 90) {\n  console.log('A grade');\n} else if(score >= 60) {\n  console.log('B grade');\n} else {\n  console.log('C grade');\n}\n// Output:\n// B grade\n</script>",
        explanation: "else if allows multiple conditions to be checked in order.",
        type: "theory"
      },
      {
        title: "Example 4: Conditional with Strings",
        content: "Check string equality with if...else.",
        code: "<script>\nlet color = 'red';\nif(color === 'blue') {\n  console.log('Color is blue');\n} else {\n  console.log('Color is not blue');\n}\n// Output:\n// Color is not blue\n</script>",
        explanation: "if...else works with any expression that evaluates to true or false, including strings.",
        type: "theory"
      },
      {
        question: "What happens when an if condition is false and there is no else?",
        options: ["The program crashes", "The code inside if runs anyway", "Nothing happens", "The next if executes automatically"],
        correctAnswer: 2,
        explanation: "If the if condition is false and no else exists, the block is skipped and nothing happens.",
        type: "question"
      },
      {
        question: "Which structure allows checking multiple conditions in order?",
        options: ["Only if", "if...else", "if...else if...else", "switch only"],
        correctAnswer: 2,
        explanation: "The if...else if...else structure allows multiple conditions to be checked sequentially.",
        type: "question"
      }
    ]
  }
},


{
  id: "javascript-switch-1",
  title: "JavaScript Switch",
  description: "Use switch statements to execute code based on different cases.",
  difficulty: "Beginner",
  baseXP: 120,
  baselineTime: 1,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic Switch",
        content: "Execute different code for different values.",
        code: "<script>\nlet day = 'Monday';\nswitch(day) {\n  case 'Monday':\n    console.log('Start');\n    break;\n  case 'Friday':\n    console.log('End');\n    break;\n  default:\n    console.log('Midweek');\n}\n// Output:\n// Start\n</script>",
        explanation: "The switch checks the value and runs the matching case until a break is reached.",
        type: "theory"
      },
      {
        title: "Example 2: Default Case",
        content: "Run default if no case matches.",
        code: "<script>\nlet color = 'green';\nswitch(color) {\n  case 'red':\n    console.log('Stop');\n    break;\n  case 'yellow':\n    console.log('Caution');\n    break;\n  default:\n    console.log('Go');\n}\n// Output:\n// Go\n</script>",
        explanation: "The default case runs when none of the other cases match.",
        type: "theory"
      },
      {
        title: "Example 3: Multiple Statements in Case",
        content: "You can include multiple lines in a single case.",
        code: "<script>\nlet fruit = 'apple';\nswitch(fruit) {\n  case 'apple':\n    console.log('Red');\n    console.log('Sweet');\n    break;\n}\n// Output:\n// Red\n// Sweet\n</script>",
        explanation: "Each case can execute multiple statements before hitting break.",
        type: "theory"
      },
      {
        title: "Example 4: Case Without Break",
        content: "Without break, execution continues to the next case.",
        code: "<script>\nlet number = 1;\nswitch(number) {\n  case 1:\n    console.log('One');\n  case 2:\n    console.log('Two');\n}\n// Output:\n// One\n// Two\n</script>",
        explanation: "Omitting break causes 'fall-through' behavior.",
        type: "theory"
      },
      {
        question: "What happens if you forget break in a switch case?",
        options: ["Only that case runs", "Next cases also run", "Switch ends immediately", "Default runs twice"],
        correctAnswer: 1,
        explanation: "Without break, the code continues executing the following cases until a break or the end.",
        type: "question"
      },
      {
        question: "Which case runs if no other case matches?",
        options: ["The first case", "A random case", "The default case", "None"],
        correctAnswer: 2,
        explanation: "The default case runs when no other case matches the value.",
        type: "question"
      }
    ]
  }
},

{
  id: "javascript-loop-for-1",
  title: "JavaScript For Loop",
  description: "Use for loops to repeat code a specific number of times.",
  difficulty: "Beginner",
  baseXP: 125,
  baselineTime: 1,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic For Loop",
        content: "Print numbers from 1 to 5.",
        code: "<script>\nfor(let i = 1; i <= 5; i++) {\n  console.log(i);\n}\n// Output:\n// 1\n// 2\n// 3\n// 4\n// 5\n</script>",
        explanation: "The for loop runs as long as the condition i <= 5 is true.",
        type: "theory"
      },
      {
        title: "Example 2: Sum with For Loop",
        content: "Calculate the sum of numbers 1 to 4.",
        code: "<script>\nlet sum = 0;\nfor(let i = 1; i <= 4; i++) {\n  sum += i;\n}\nconsole.log(sum);\n// Output:\n// 10\n</script>",
        explanation: "For loops are useful for iterating a fixed number of times.",
        type: "theory"
      },
      {
        title: "Example 3: Loop with Step",
        content: "Print even numbers from 2 to 10.",
        code: "<script>\nfor(let i = 2; i <= 10; i+=2) {\n  console.log(i);\n}\n// Output:\n// 2\n// 4\n// 6\n// 8\n// 10\n</script>",
        explanation: "You can change the step by modifying the increment expression.",
        type: "theory"
      },
      {
        title: "Example 4: Loop Over Array",
        content: "Print elements of an array.",
        code: "<script>\nlet fruits = ['apple','banana','cherry'];\nfor(let i = 0; i < fruits.length; i++) {\n  console.log(fruits[i]);\n}\n// Output:\n// apple\n// banana\n// cherry\n</script>",
        explanation: "Use array length and indexing to iterate through arrays.",
        type: "theory"
      },
      {
        question: "What does 'i += 2' do in a for loop?",
        options: ["Subtracts 2 from i each time", "Adds 2 to i each time", "Sets i to 2", "Ends the loop"],
        correctAnswer: 1,
        explanation: "i += 2 increases the value of i by 2 in each iteration.",
        type: "question"
      },
      {
        question: "How do you access array elements inside a for loop?",
        options: ["fruits[i]", "fruits.loop()", "fruits[]", "fruits.index()"],
        correctAnswer: 0,
        explanation: "Use the loop variable as the index to access array elements.",
        type: "question"
      }
    ]
  }
},

{
  id: "javascript-loop-while-1",
  title: "JavaScript While Loop",
  description: "Use while loops to repeat code while a condition is true.",
  difficulty: "Intermediate",
  baseXP: 140,
  baselineTime: 1.5,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic While Loop",
        content: "Print numbers from 1 to 5.",
        code: "<script>\nlet i = 1;\nwhile(i <= 5) {\n  console.log(i);\n  i++;\n}\n// Output:\n// 1\n// 2\n// 3\n// 4\n// 5\n</script>",
        explanation: "The loop continues as long as the condition i <= 5 is true.",
        type: "theory"
      },
      {
        title: "Example 2: Sum with While Loop",
        content: "Calculate sum of numbers 1 to 4.",
        code: "<script>\nlet sum = 0;\nlet i = 1;\nwhile(i <= 4) {\n  sum += i;\n  i++;\n}\nconsole.log(sum);\n// Output:\n// 10\n</script>",
        explanation: "You can accumulate values inside a while loop like with for loops.",
        type: "theory"
      },
      {
        title: "Example 3: Loop Until Condition False",
        content: "Print numbers less than 10 but increment by 2.",
        code: "<script>\nlet n = 0;\nwhile(n < 10) {\n  console.log(n);\n  n += 2;\n}\n// Output:\n// 0\n// 2\n// 4\n// 6\n// 8\n</script>",
        explanation: "You can change the increment inside a while loop.",
        type: "theory"
      },
      {
        title: "Example 4: Using Break in While",
        content: "Stop the loop when a condition is met.",
        code: "<script>\nlet i = 1;\nwhile(true) {\n  console.log(i);\n  if(i >= 3) break;\n  i++;\n}\n// Output:\n// 1\n// 2\n// 3\n</script>",
        explanation: "Break exits the loop even if the condition is still true.",
        type: "theory"
      },
      {
        question: "What is the main difference between for and while loops?",
        options: ["For loops never stop", "While loops need a condition", "For loops cannot iterate arrays", "While loops cannot use break"],
        correctAnswer: 1,
        explanation: "While loops rely only on a condition and are useful when the number of iterations is unknown.",
        type: "question"
      },
      {
        question: "What happens if a while loop condition is always true without break?",
        options: ["It stops automatically", "It runs forever", "It skips the loop", "It throws error"],
        correctAnswer: 1,
        explanation: "A loop with a condition that is always true and no break will run indefinitely.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-loop-for-of-1",
  title: "JavaScript For...Of Loop",
  description: "Use for...of to iterate over iterable objects like arrays or strings.",
  difficulty: "Intermediate",
  baseXP: 150,
  baselineTime: 1.5,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Iterate Array",
        content: "Print all elements of an array.",
        code: "<script>\nlet fruits = ['apple', 'banana', 'cherry'];\nfor (let fruit of fruits) {\n  console.log(fruit);\n}\n// Output:\n// apple\n// banana\n// cherry\n</script>",
        explanation: "for...of iterates over each element directly without using an index.",
        type: "theory"
      },
      {
        title: "Example 2: Iterate String",
        content: "Print each character of a string.",
        code: "<script>\nlet name = 'Tom';\nfor (let char of name) {\n  console.log(char);\n}\n// Output:\n// T\n// o\n// m\n</script>",
        explanation: "for...of works with any iterable object, including strings.",
        type: "theory"
      },
      {
        title: "Example 3: Sum Array Values",
        content: "Add all numbers in an array.",
        code: "<script>\nlet numbers = [1, 2, 3];\nlet sum = 0;\nfor (let num of numbers) {\n  sum += num;\n}\nconsole.log(sum);\n// Output:\n// 6\n</script>",
        explanation: "You can perform calculations directly on elements while looping.",
        type: "theory"
      },
      {
        title: "Example 4: Nested For...Of",
        content: "Iterate arrays within arrays.",
        code: "<script>\nlet matrix = [[1,2],[3,4]];\nfor (let row of matrix) {\n  for (let num of row) {\n    console.log(num);\n  }\n}\n// Output:\n// 1\n// 2\n// 3\n// 4\n</script>",
        explanation: "You can nest for...of loops to iterate multi-dimensional arrays.",
        type: "theory"
      },
      {
        question: "Which types of objects can for...of loop iterate over?",
        options: ["Only arrays", "Only numbers", "Iterables like arrays and strings", "Only objects with keys"],
        correctAnswer: 2,
        explanation: "for...of works with iterable objects such as arrays, strings, maps, and sets.",
        type: "question"
      },
      {
        question: "How is for...of different from a regular for loop?",
        options: ["It uses index to access elements", "It iterates directly over values", "It can only loop once", "It cannot loop over arrays"],
        correctAnswer: 1,
        explanation: "for...of gives direct access to each element without using an index.",
        type: "question"
      }
    ]
  }
},

{
  id: "javascript-break-1",
  title: "JavaScript Break",
  description: "Use break to exit loops early when a condition is met.",
  difficulty: "Intermediate",
  baseXP: 160,
  baselineTime: 1.5,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Break in For Loop",
        content: "Stop a loop when a certain value is reached.",
        code: "<script>\nfor(let i = 1; i <= 5; i++) {\n  if(i === 3) break;\n  console.log(i);\n}\n// Output:\n// 1\n// 2\n</script>",
        explanation: "break exits the loop immediately when the condition is true.",
        type: "theory"
      },
      {
        title: "Example 2: Break in While Loop",
        content: "Use break to stop an infinite loop.",
        code: "<script>\nlet i = 0;\nwhile(true) {\n  if(i === 2) break;\n  console.log(i);\n  i++;\n}\n// Output:\n// 0\n// 1\n</script>",
        explanation: "break is useful for exiting loops with dynamic conditions.",
        type: "theory"
      },
      {
        title: "Example 3: Break in Nested Loops",
        content: "Break stops only the current loop.",
        code: "<script>\nfor(let i = 1; i <= 3; i++) {\n  for(let j = 1; j <= 3; j++) {\n    if(j === 2) break;\n    console.log(i, j);\n  }\n}\n// Output:\n// 1 1\n// 2 1\n// 3 1\n</script>",
        explanation: "In nested loops, break exits only the loop where it is used.",
        type: "theory"
      },
      {
        title: "Example 4: Using Break with Condition",
        content: "Stop iterating if a condition is met in an array.",
        code: "<script>\nlet numbers = [1,2,3,4];\nfor(let num of numbers) {\n  if(num > 2) break;\n  console.log(num);\n}\n// Output:\n// 1\n// 2\n</script>",
        explanation: "break can stop iteration in any type of loop when a condition occurs.",
        type: "theory"
      },
      {
        question: "What happens when break is used inside a loop?",
        options: ["The loop skips one iteration", "The loop ends immediately", "The loop restarts", "Nothing happens"],
        correctAnswer: 1,
        explanation: "break immediately exits the loop regardless of the loop condition.",
        type: "question"
      },
      {
        question: "In nested loops, which loop does break affect?",
        options: ["All loops at once", "Only the innermost loop containing it", "Only outermost loop", "It doesn’t work in nested loops"],
        correctAnswer: 1,
        explanation: "break exits only the loop in which it is placed.",
        type: "question"
      }
    ]
  }
},

{
  id: "javascript-functions-1",
  title: "JavaScript Functions",
  description: "Learn how to define and use functions to organize reusable blocks of code.",
  difficulty: "Intermediate",
  baseXP: 170,
  baselineTime: 1.5,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic Function",
        content: "Define a function and call it.",
        code: "<script>\nfunction greet() {\n  console.log('Hello!');\n}\ngreet();\n// Output:\n// Hello!\n</script>",
        explanation: "A function is defined with the function keyword and executed by calling its name followed by parentheses.",
        type: "theory"
      },
      {
        title: "Example 2: Function with Return",
        content: "Return a value from a function.",
        code: "<script>\nfunction add(a, b) {\n  return a + b;\n}\nconsole.log(add(5, 3));\n// Output:\n// 8\n</script>",
        explanation: "return sends a value back to where the function was called.",
        type: "theory"
      },
      {
        title: "Example 3: Function Expression",
        content: "Store a function in a variable.",
        code: "<script>\nconst sayBye = function() {\n  console.log('Goodbye!');\n};\nsayBye();\n// Output:\n// Goodbye!\n</script>",
        explanation: "Functions can be stored in variables, allowing flexible usage.",
        type: "theory"
      },
      {
        title: "Example 4: Functions with Parameters",
        content: "Pass values into functions.",
        code: "<script>\nfunction multiply(x, y) {\n  console.log(x * y);\n}\nmultiply(4, 6);\n// Output:\n// 24\n</script>",
        explanation: "Parameters let you pass data into a function to be used inside it.",
        type: "theory"
      },
      {
        question: "What is the main purpose of a function in JavaScript?",
        options: ["To execute code once", "To store reusable code blocks", "To define variables only", "To comment code"],
        correctAnswer: 1,
        explanation: "Functions are primarily used to group reusable code that can be executed whenever needed.",
        type: "question"
      },
      {
        question: "How do you execute a function after defining it?",
        options: ["Write its name alone", "Call it with parentheses", "Use return keyword", "Use console.log only"],
        correctAnswer: 1,
        explanation: "Functions are executed by calling their name followed by parentheses, optionally passing arguments.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-function-definitions-1",
  title: "JavaScript Function Definitions",
  description: "Learn the different ways to define functions in JavaScript and when to use each.",
  difficulty: "Intermediate",
  baseXP: 180,
  baselineTime: 1.5,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Function Declaration",
        content: "Define a function using the declaration syntax.",
        code: "<script>\nfunction sayHello() {\n  console.log('Hello World');\n}\nsayHello();\n// Output:\n// Hello World\n</script>",
        explanation: "Function declarations are hoisted, meaning you can call them before their definition in code.",
        type: "theory"
      },
      {
        title: "Example 2: Function Expression",
        content: "Define a function using an expression and assign it to a variable.",
        code: "<script>\nconst greet = function() {\n  console.log('Hi there!');\n};\ngreet();\n// Output:\n// Hi there!\n</script>",
        explanation: "Function expressions are not hoisted and must be defined before they are called.",
        type: "theory"
      },
      {
        title: "Example 3: Named Function Expression",
        content: "Give a name to a function expression.",
        code: "<script>\nconst sayBye = function bye() {\n  console.log('Goodbye');\n};\nsayBye();\n// Output:\n// Goodbye\n</script>",
        explanation: "Naming a function expression helps in debugging but the function name cannot be called directly from outside.",
        type: "theory"
      },
      {
        title: "Example 4: Anonymous Function Expression",
        content: "Use an anonymous function in an event or callback.",
        code: "<script>\nsetTimeout(function() {\n  console.log('Executed after 1 second');\n}, 1000);\n// Output (after 1 second):\n// Executed after 1 second\n</script>",
        explanation: "Anonymous functions have no name and are often used as arguments or callbacks.",
        type: "theory"
      },
      {
        question: "Which function type is hoisted in JavaScript?",
        options: ["Function Declaration", "Function Expression", "Anonymous Function", "Arrow Function"],
        correctAnswer: 0,
        explanation: "Function declarations are hoisted, allowing them to be called before their definition.",
        type: "question"
      },
      {
        question: "What is a common use for anonymous functions?",
        options: ["Define global variables", "Use as callback or event handler", "Store in arrays", "Only for debugging"],
        correctAnswer: 1,
        explanation: "Anonymous functions are often used as callbacks or event handlers where a function name is not needed.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-function-arrows-1",
  title: "JavaScript Arrow Functions",
  description: "Learn how to define functions using the arrow (=>) syntax and understand their benefits.",
  difficulty: "Intermediate",
  baseXP: 190,
  baselineTime: 1.5,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic Arrow Function",
        content: "Define a function using the arrow syntax.",
        code: "<script>\nconst greet = () => {\n  console.log('Hello!');\n};\ngreet();\n// Output:\n// Hello!\n</script>",
        explanation: "Arrow functions provide a concise syntax for defining functions.",
        type: "theory"
      },
      {
        title: "Example 2: Single Parameter",
        content: "Use a single parameter without parentheses.",
        code: "<script>\nconst square = x => {\n  console.log(x * x);\n};\nsquare(4);\n// Output:\n// 16\n</script>",
        explanation: "If an arrow function has only one parameter, parentheses are optional.",
        type: "theory"
      },
      {
        title: "Example 3: Implicit Return",
        content: "Return a value implicitly without braces.",
        code: "<script>\nconst add = (a, b) => a + b;\nconsole.log(add(3, 5));\n// Output:\n// 8\n</script>",
        explanation: "Without curly braces, the expression after the arrow is returned automatically.",
        type: "theory"
      },
      {
        title: "Example 4: Arrow Function in Array Methods",
        content: "Use an arrow function with map().",
        code: "<script>\nconst numbers = [1, 2, 3];\nconst doubled = numbers.map(n => n * 2);\nconsole.log(doubled);\n// Output:\n// [2, 4, 6]\n</script>",
        explanation: "Arrow functions are often used in array methods for concise code.",
        type: "theory"
      },
      {
        question: "Which feature is unique to arrow functions compared to regular functions?",
        options: ["Hoisting", "Implicit return", "Block scoping", "Named functions"],
        correctAnswer: 1,
        explanation: "Arrow functions can return values implicitly without using the return keyword when braces are omitted.",
        type: "question"
      },
      {
        question: "When can you omit parentheses around parameters in an arrow function?",
        options: ["Always", "Only with no parameters", "Only with one parameter", "Only inside objects"],
        correctAnswer: 2,
        explanation: "If the function has exactly one parameter, parentheses around it can be omitted.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-function-parameters-1",
  title: "JavaScript Function Parameters",
  description: "Learn how to pass parameters to functions and use default values.",
  difficulty: "Intermediate",
  baseXP: 200,
  baselineTime: 1.5,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic Parameters",
        content: "Pass parameters to a function.",
        code: "<script>\nfunction greet(name) {\n  console.log('Hello, ' + name + '!');\n}\ngreet('Alice');\n// Output:\n// Hello, Alice!\n</script>",
        explanation: "Functions can take input values called parameters to customize behavior.",
        type: "theory"
      },
      {
        title: "Example 2: Multiple Parameters",
        content: "Use more than one parameter.",
        code: "<script>\nfunction add(a, b) {\n  console.log(a + b);\n}\nadd(5, 7);\n// Output:\n// 12\n</script>",
        explanation: "Functions can have multiple parameters separated by commas.",
        type: "theory"
      },
      {
        title: "Example 3: Default Parameters",
        content: "Assign default values to parameters.",
        code: "<script>\nfunction greet(name = 'Guest') {\n  console.log('Hello, ' + name + '!');\n}\ngreet();\n// Output:\n// Hello, Guest!\n</script>",
        explanation: "If a parameter is not provided, the default value is used.",
        type: "theory"
      },
      {
        title: "Example 4: Using Parameters in Expressions",
        content: "Perform operations with parameters.",
        code: "<script>\nfunction multiply(a, b) {\n  return a * b;\n}\nconsole.log(multiply(4, 6));\n// Output:\n// 24\n</script>",
        explanation: "Parameters can be used in calculations and expressions inside functions.",
        type: "theory"
      },
      {
        question: "What happens if you call a function without providing a parameter that has a default value?",
        options: ["An error occurs", "The function uses the default value", "The function returns undefined", "The program stops"],
        correctAnswer: 1,
        explanation: "If a parameter has a default value, that value is used when no argument is provided.",
        type: "question"
      },
      {
        question: "How can you pass multiple values to a function?",
        options: ["Using arrays only", "Separating them with commas in the function call", "Using objects only", "Using semicolons in the call"],
        correctAnswer: 1,
        explanation: "You can pass multiple values by separating them with commas in the function call, matching the parameters.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-function-invocation-1",
  title: "JavaScript Function Invocation",
  description: "Learn how to call (invoke) functions in JavaScript and understand their behavior.",
  difficulty: "Intermediate",
  baseXP: 210,
  baselineTime: 1.5,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic Function Call",
        content: "Invoke a function by using its name followed by parentheses.",
        code: "<script>\nfunction sayHello() {\n  console.log('Hello!');\n}\nsayHello();\n// Output:\n// Hello!\n</script>",
        explanation: "Functions are executed when they are called (invoked) using parentheses.",
        type: "theory"
      },
      {
        title: "Example 2: Calling a Function with Arguments",
        content: "Pass arguments when invoking a function.",
        code: "<script>\nfunction greet(name) {\n  console.log('Hi, ' + name + '!');\n}\ngreet('Bob');\n// Output:\n// Hi, Bob!\n</script>",
        explanation: "Arguments provided during invocation are assigned to the function’s parameters.",
        type: "theory"
      },
      {
        title: "Example 3: Using Return Values",
        content: "Invoke a function and use its returned value.",
        code: "<script>\nfunction add(a, b) {\n  return a + b;\n}\nlet result = add(3, 4);\nconsole.log(result);\n// Output:\n// 7\n</script>",
        explanation: "Functions can return values which can then be stored or used in expressions.",
        type: "theory"
      },
      {
        title: "Example 4: Nested Function Calls",
        content: "Call a function inside another function call.",
        code: "<script>\nfunction square(x) {\n  return x * x;\n}\nconsole.log(square(add(2, 3)));\n// Output:\n// 25\n</script>",
        explanation: "Functions can be called within other function calls to compute values in steps.",
        type: "theory"
      },
      {
        question: "What happens when you invoke a function without parentheses?",
        options: ["The function runs immediately", "Nothing happens, it just refers to the function", "An error occurs", "The program stops"],
        correctAnswer: 1,
        explanation: "Without parentheses, the function reference is returned, but the function does not run.",
        type: "question"
      },
      {
        question: "How do you use the value returned by a function?",
        options: ["It cannot be used", "Store it in a variable or use it in an expression", "It prints automatically", "It overwrites all variables"],
        correctAnswer: 1,
        explanation: "Return values can be stored in variables or used directly in expressions for further calculations.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-function-closures-1",
  title: "JavaScript Function Closures",
  description: "Understand closures in JavaScript and how inner functions can access outer function variables.",
  difficulty: "Intermediate",
  baseXP: 220,
  baselineTime: 1.5,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic Closure",
        content: "An inner function can access variables from its outer function.",
        code: "<script>\nfunction outer() {\n  let outerVar = 'I am outside!';\n  function inner() {\n    console.log(outerVar);\n  }\n  inner();\n}\nouter();\n// Output:\n// I am outside!\n</script>",
        explanation: "Closures allow inner functions to remember and access variables from their outer scope.",
        type: "theory"
      },
      {
        title: "Example 2: Returning a Function",
        content: "Return an inner function to use later with access to outer variables.",
        code: "<script>\nfunction makeCounter() {\n  let count = 0;\n  return function() {\n    count++;\n    console.log(count);\n  };\n}\nlet counter = makeCounter();\ncounter();\ncounter();\n// Output:\n// 1\n// 2\n</script>",
        explanation: "Returned inner functions maintain access to their original outer variables even after the outer function has finished executing.",
        type: "theory"
      },
      {
        title: "Example 3: Multiple Closures",
        content: "Create multiple closures with independent variables.",
        code: "<script>\nlet counter1 = makeCounter();\nlet counter2 = makeCounter();\ncounter1();\ncounter2();\ncounter1();\n// Output:\n// 1\n// 1\n// 2\n</script>",
        explanation: "Each closure has its own separate copy of the outer function's variables.",
        type: "theory"
      },
      {
        title: "Example 4: Closure with Parameters",
        content: "Pass parameters to outer function and use them in the closure.",
        code: "<script>\nfunction multiplier(factor) {\n  return function(number) {\n    return number * factor;\n  };\n}\nlet double = multiplier(2);\nconsole.log(double(5));\n// Output:\n// 10\n</script>",
        explanation: "Closures can use both outer variables and parameters to produce customized behavior.",
        type: "theory"
      },
      {
        question: "What is a closure in JavaScript?",
        options: ["A function that is called immediately", "An inner function that has access to its outer function variables", "A function without parameters", "A loop inside a function"],
        correctAnswer: 1,
        explanation: "A closure is an inner function that remembers and can access variables from its outer function, even after the outer function has finished.",
        type: "question"
      },
      {
        question: "Why does each counter in the makeCounter example maintain a separate count?",
        options: ["Because they are global variables", "Because each call creates a new closure with its own copy of variables", "Because JavaScript resets variables automatically", "Because of for loops"],
        correctAnswer: 1,
        explanation: "Each call to makeCounter creates a new closure, so each returned function has its own independent count variable.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-objects-1",
  title: "JavaScript Objects",
  description: "Learn what objects are and how to create them.",
  difficulty: "Intermediate",
  baseXP: 230,
  baselineTime: 1.5,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Creating an Object",
        content: "Create a simple object to store person information.",
        code: "<script>\nlet person = { name: 'Alice', age: 25 };\nconsole.log(person);\n// Output:\n// { name: 'Alice', age: 25 }\n</script>",
        explanation: "Objects store related data as key-value pairs.",
        type: "theory"
      },
      {
        title: "Example 2: Accessing Object Properties",
        content: "Access object values using dot or bracket notation.",
        code: "<script>\nconsole.log(person.name);\n// Output:\n// Alice\nconsole.log(person['age']);\n// Output:\n// 25\n</script>",
        explanation: "Dot notation is common; bracket notation allows dynamic property names.",
        type: "theory"
      },
      {
        title: "Example 3: Adding Properties",
        content: "Add a new property to the object.",
        code: "<script>\nperson.city = 'Paris';\nconsole.log(person);\n// Output:\n// { name: 'Alice', age: 25, city: 'Paris' }\n</script>",
        explanation: "Objects can be extended with new key-value pairs.",
        type: "theory"
      },
      {
        title: "Example 4: Nested Objects",
        content: "Objects can contain other objects.",
        code: "<script>\nperson.address = { street: 'Main St', number: 123 };\nconsole.log(person.address.street);\n// Output:\n// Main St\n</script>",
        explanation: "Nested objects allow more complex data structures.",
        type: "theory"
      },
      {
        question: "What type of data structure stores key-value pairs?",
        options: ["Array", "Object", "String", "Number"],
        correctAnswer: 1,
        explanation: "Objects store data as key-value pairs.",
        type: "question"
      },
      {
        question: "Which notation allows you to access properties using a variable name?",
        options: ["Dot notation", "Bracket notation", "Both", "Neither"],
        correctAnswer: 1,
        explanation: "Bracket notation allows dynamic property access using a variable.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-object-properties-1",
  title: "Object Properties",
  description: "Learn how to work with properties of objects in JavaScript.",
  difficulty: "Intermediate",
  baseXP: 240,
  baselineTime: 1.5,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Reading Properties",
        content: "Read values from an object using dot notation.",
        code: "<script>\nlet car = { brand: 'Toyota', year: 2020 };\nconsole.log(car.brand);\n// Output:\n// Toyota\n</script>",
        explanation: "Dot notation reads the value of a property.",
        type: "theory"
      },
      {
        title: "Example 2: Using Bracket Notation",
        content: "Access properties dynamically using bracket notation.",
        code: "<script>\nlet prop = 'year';\nconsole.log(car[prop]);\n// Output:\n// 2020\n</script>",
        explanation: "Bracket notation allows property names to be stored in variables.",
        type: "theory"
      },
      {
        title: "Example 3: Updating Properties",
        content: "Change the value of an existing property.",
        code: "<script>\ncar.year = 2021;\nconsole.log(car.year);\n// Output:\n// 2021\n</script>",
        explanation: "You can modify object properties anytime.",
        type: "theory"
      },
      {
        title: "Example 4: Deleting Properties",
        content: "Remove a property from an object.",
        code: "<script>\ndelete car.brand;\nconsole.log(car);\n// Output:\n// { year: 2021 }\n</script>",
        explanation: "delete removes a property from an object.",
        type: "theory"
      },
      {
        question: "Which operator is used to remove a property from an object?",
        options: ["remove", "delete", "erase", "null"],
        correctAnswer: 1,
        explanation: "The delete operator removes a property from an object.",
        type: "question"
      },
      {
        question: "How can you update an object property?",
        options: ["You cannot update it", "Assign a new value using = ", "Use delete operator", "Use push()"],
        correctAnswer: 1,
        explanation: "You can update a property by assigning a new value using =.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-object-methods-1",
  title: "Object Methods",
  description: "Learn how to add and use functions inside objects.",
  difficulty: "Intermediate",
  baseXP: 250,
  baselineTime: 1.5,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Adding a Method",
        content: "Add a function as a method of an object.",
        code: "<script>\nlet person = {\n  name: 'Alice',\n  greet: function() { console.log('Hello, ' + this.name); }\n};\nperson.greet();\n// Output:\n// Hello, Alice\n</script>",
        explanation: "Functions inside objects are called methods.",
        type: "theory"
      },
      {
        title: "Example 2: Using this",
        content: "Use this to access the object’s properties.",
        code: "<script>\nperson.age = 25;\nperson.showAge = function() { console.log(this.age); };\nperson.showAge();\n// Output:\n// 25\n</script>",
        explanation: "this refers to the current object inside a method.",
        type: "theory"
      },
      {
        title: "Example 3: Method Shorthand",
        content: "Use shorthand to define methods in objects.",
        code: "<script>\nperson.sayBye() { console.log('Bye'); }\n// Output will be after calling person.sayBye();\n</script>",
        explanation: "ES6 allows a shorter syntax for methods inside objects.",
        type: "theory"
      },
      {
        title: "Example 4: Methods with Parameters",
        content: "Methods can accept parameters.",
        code: "<script>\nperson.introduce = function(friend) { console.log('Hi ' + friend + ', I am ' + this.name); };\nperson.introduce('Bob');\n// Output:\n// Hi Bob, I am Alice\n</script>",
        explanation: "Methods can take arguments like regular functions.",
        type: "theory"
      },
      {
        question: "What does the keyword 'this' refer to inside a method?",
        options: ["The global object", "The object itself", "A variable outside", "It has no meaning"],
        correctAnswer: 1,
        explanation: "'this' refers to the object that owns the method.",
        type: "question"
      },
      {
        question: "How do you define a method inside an object?",
        options: ["Assign a function to a property", "Use a variable outside", "Call a function directly", "Use array notation"],
        correctAnswer: 0,
        explanation: "Methods are functions assigned to object properties.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-arrays-1",
  title: "JavaScript Arrays",
  description: "Learn how to create and use arrays in JavaScript.",
  difficulty: "Intermediate",
  baseXP: 260,
  baselineTime: 1.5,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Creating an Array",
        content: "Create an array of numbers.",
        code: "<script>\nlet numbers = [1, 2, 3, 4, 5];\nconsole.log(numbers);\n// Output:\n// [1, 2, 3, 4, 5]\n</script>",
        explanation: "Arrays store multiple values in a single variable.",
        type: "theory"
      },
      {
        title: "Example 2: Accessing Array Elements",
        content: "Use index to access array elements.",
        code: "<script>\nconsole.log(numbers[0]);\n// Output:\n// 1\nconsole.log(numbers[3]);\n// Output:\n// 4\n</script>",
        explanation: "Array indices start at 0, so the first element is numbers[0].",
        type: "theory"
      },
      {
        title: "Example 3: Changing Elements",
        content: "Modify an array element using its index.",
        code: "<script>\nnumbers[2] = 10;\nconsole.log(numbers);\n// Output:\n// [1, 2, 10, 4, 5]\n</script>",
        explanation: "You can change the value of an array element by assigning a new value to its index.",
        type: "theory"
      },
      {
        title: "Example 4: Array Length",
        content: "Check the number of elements in an array.",
        code: "<script>\nconsole.log(numbers.length);\n// Output:\n// 5\n</script>",
        explanation: "The length property returns the number of elements in the array.",
        type: "theory"
      },
      {
        question: "Which index represents the first element in an array?",
        options: ["0", "1", "First", "None"],
        correctAnswer: 0,
        explanation: "Array indices start at 0 in JavaScript.",
        type: "question"
      },
      {
        question: "How can you find out how many elements an array has?",
        options: ["Using count()", "Using length property", "Using size()", "Using index"],
        correctAnswer: 1,
        explanation: "The length property returns the number of elements in an array.",
        type: "question"
      }
    ]
  }
},

{
  id: "javascript-array-methods-1",
  title: "Array Methods",
  description: "Learn common methods to manipulate arrays in JavaScript.",
  difficulty: "Intermediate",
  baseXP: 270,
  baselineTime: 1.5,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: push() Method",
        content: "Add an element at the end of the array.",
        code: "<script>\nnumbers.push(6);\nconsole.log(numbers);\n// Output:\n// [1, 2, 10, 4, 5, 6]\n</script>",
        explanation: "push() adds one or more elements to the end of an array.",
        type: "theory"
      },
      {
        title: "Example 2: pop() Method",
        content: "Remove the last element from an array.",
        code: "<script>\nnumbers.pop();\nconsole.log(numbers);\n// Output:\n// [1, 2, 10, 4, 5]\n</script>",
        explanation: "pop() removes the last element from the array and returns it.",
        type: "theory"
      },
      {
        title: "Example 3: unshift() Method",
        content: "Add an element at the beginning of an array.",
        code: "<script>\nnumbers.unshift(0);\nconsole.log(numbers);\n// Output:\n// [0, 1, 2, 10, 4, 5]\n</script>",
        explanation: "unshift() adds elements to the start of an array.",
        type: "theory"
      },
      {
        title: "Example 4: shift() Method",
        content: "Remove the first element from an array.",
        code: "<script>\nnumbers.shift();\nconsole.log(numbers);\n// Output:\n// [1, 2, 10, 4, 5]\n</script>",
        explanation: "shift() removes the first element from the array.",
        type: "theory"
      },
      {
        question: "Which method adds elements to the end of an array?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        correctAnswer: 0,
        explanation: "push() adds elements to the end of an array.",
        type: "question"
      },
      {
        question: "Which method removes the first element from an array?",
        options: ["shift()", "pop()", "push()", "unshift()"],
        correctAnswer: 0,
        explanation: "shift() removes the first element of an array.",
        type: "question"
      }
    ]
  }
},

{
  id: "javascript-array-iterations-1",
  title: "Array Iterations",
  description: "Learn how to loop through arrays in JavaScript.",
  difficulty: "Intermediate",
  baseXP: 280,
  baselineTime: 1.5,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: for Loop",
        content: "Loop through array elements using for.",
        code: "<script>\nfor(let i = 0; i < numbers.length; i++) {\n  console.log(numbers[i]);\n}\n</script>",
        explanation: "for loops can iterate over arrays using the index.",
        type: "theory"
      },
      {
        title: "Example 2: for...of Loop",
        content: "Loop through array elements using for...of.",
        code: "<script>\nfor(let num of numbers) {\n  console.log(num);\n}\n</script>",
        explanation: "for...of loops iterate directly over values of an array.",
        type: "theory"
      },
      {
        title: "Example 3: forEach Method",
        content: "Use forEach to iterate over array elements.",
        code: "<script>\nnumbers.forEach(function(num) {\n  console.log(num);\n});\n</script>",
        explanation: "forEach executes a function for each element of the array.",
        type: "theory"
      },
      {
        title: "Example 4: Using Arrow Functions",
        content: "Use an arrow function with forEach.",
        code: "<script>\nnumbers.forEach(num => console.log(num));\n</script>",
        explanation: "Arrow functions provide a concise syntax for callbacks.",
        type: "theory"
      },
      {
        question: "Which loop allows you to iterate directly over array values?",
        options: ["for", "for...of", "while", "do...while"],
        correctAnswer: 1,
        explanation: "for...of loops iterate directly over the array values.",
        type: "question"
      },
      {
        question: "Which array method can execute a function for each element?",
        options: ["map()", "filter()", "forEach()", "reduce()"],
        correctAnswer: 2,
        explanation: "forEach() executes a function for each element in an array.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-array-sort-1",
  title: "Array Sort",
  description: "Learn how to sort arrays in JavaScript.",
  difficulty: "Intermediate",
  baseXP: 290,
  baselineTime: 1.5,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Sorting Numbers",
        content: "Use sort() to order numbers.",
        code: "<script>\nlet nums = [3, 1, 4, 2];\nnums.sort();\nconsole.log(nums);\n// Output:\n// [1, 2, 3, 4]\n</script>",
        explanation: "sort() orders array elements alphabetically by default.",
        type: "theory"
      },
      {
        title: "Example 2: Sorting Strings",
        content: "Sort an array of strings.",
        code: "<script>\nlet fruits = ['Banana', 'Apple', 'Cherry'];\nfruits.sort();\nconsole.log(fruits);\n// Output:\n// ['Apple', 'Banana', 'Cherry']\n</script>",
        explanation: "sort() works with strings in alphabetical order.",
        type: "theory"
      },
      {
        title: "Example 3: Custom Sort Function",
        content: "Sort numbers using a compare function.",
        code: "<script>\nnums.sort((a, b) => b - a);\nconsole.log(nums);\n// Output:\n// [4, 3, 2, 1]\n</script>",
        explanation: "Providing a compare function allows custom sorting.",
        type: "theory"
      },
      {
        title: "Example 4: Sorting Objects",
        content: "Sort an array of objects by a property.",
        code: "<script>\nlet people = [{name:'Alice', age:25},{name:'Bob', age:20}];\npeople.sort((a,b) => a.age - b.age);\nconsole.log(people);\n// Output:\n// [{name:'Bob', age:20},{name:'Alice', age:25}]\n</script>",
        explanation: "Arrays of objects can be sorted by a specific property.",
        type: "theory"
      },
      {
        question: "What is the default behavior of sort() without a compare function?",
        options: ["Sorts numbers numerically", "Sorts strings alphabetically", "Does not sort", "Sorts randomly"],
        correctAnswer: 1,
        explanation: "By default, sort() converts elements to strings and sorts alphabetically.",
        type: "question"
      },
      {
        question: "How can you sort an array of numbers in descending order?",
        options: ["Use nums.sort()", "Use nums.sort((a,b)=>b-a)", "Use nums.reverse()", "Use nums.sort((a,b)=>a-b)"],
        correctAnswer: 1,
        explanation: "Providing a compare function (b - a) sorts numbers descending.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-strings-1",
  title: "JavaScript Strings",
  description: "Learn how to create and manipulate strings in JavaScript.",
  difficulty: "Intermediate",
  baseXP: 300,
  baselineTime: 1.5,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Creating Strings",
        content: "Create strings using single or double quotes.",
        code: "<script>\nlet greeting = 'Hello';\nlet name = \"Alice\";\nconsole.log(greeting + ' ' + name);\n// Output:\n// Hello Alice\n</script>",
        explanation: "Strings can be enclosed in single or double quotes.",
        type: "theory"
      },
      {
        title: "Example 2: String Length",
        content: "Check the number of characters in a string.",
        code: "<script>\nconsole.log(name.length);\n// Output:\n// 5\n</script>",
        explanation: "The length property gives the number of characters in a string.",
        type: "theory"
      },
      {
        title: "Example 3: Accessing Characters",
        content: "Use index to access a character.",
        code: "<script>\nconsole.log(greeting[0]);\n// Output:\n// H\n</script>",
        explanation: "String indices start at 0, similar to arrays.",
        type: "theory"
      },
      {
        title: "Example 4: Template Literals",
        content: "Embed variables using backticks.",
        code: "<script>\nconsole.log(`${greeting}, ${name}!`);\n// Output:\n// Hello, Alice!\n</script>",
        explanation: "Template literals allow easy variable embedding and multi-line strings.",
        type: "theory"
      },
      {
        question: "Which symbol is used for template literals?",
        options: ["'", "\"", "`", "#"],
        correctAnswer: 2,
        explanation: "Backticks (`) are used for template literals.",
        type: "question"
      },
      {
        question: "What does the length property of a string return?",
        options: ["Number of words", "Number of characters", "Number of spaces only", "ASCII value sum"],
        correctAnswer: 1,
        explanation: "The length property returns the total number of characters in the string.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-string-methods-1",
  title: "String Methods",
  description: "Learn how to use built-in methods to manipulate strings.",
  difficulty: "Intermediate",
  baseXP: 310,
  baselineTime: 1.5,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: toUpperCase()",
        content: "Convert string to uppercase.",
        code: "<script>\nconsole.log(greeting.toUpperCase());\n// Output:\n// HELLO\n</script>",
        explanation: "toUpperCase() converts all characters to uppercase.",
        type: "theory"
      },
      {
        title: "Example 2: toLowerCase()",
        content: "Convert string to lowercase.",
        code: "<script>\nconsole.log(name.toLowerCase());\n// Output:\n// alice\n</script>",
        explanation: "toLowerCase() converts all characters to lowercase.",
        type: "theory"
      },
      {
        title: "Example 3: includes()",
        content: "Check if a substring exists.",
        code: "<script>\nconsole.log(greeting.includes('lo'));\n// Output:\n// true\n</script>",
        explanation: "includes() returns true if the substring is found.",
        type: "theory"
      },
      {
        title: "Example 4: slice()",
        content: "Extract part of a string.",
        code: "<script>\nconsole.log(greeting.slice(0, 2));\n// Output:\n// He\n</script>",
        explanation: "slice(start, end) extracts part of the string from start to end index.",
        type: "theory"
      },
      {
        question: "Which method checks if a substring exists in a string?",
        options: ["find()", "includes()", "index()", "search()"],
        correctAnswer: 1,
        explanation: "includes() checks if a substring exists in the string.",
        type: "question"
      },
      {
        question: "Which method extracts part of a string using indices?",
        options: ["slice()", "split()", "substring()", "splice()"],
        correctAnswer: 0,
        explanation: "slice() extracts part of a string using start and end indices.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-numbers-1",
  title: "JavaScript Numbers",
  description: "Learn how to work with numbers in JavaScript.",
  difficulty: "Advanced",
  baseXP: 330,
  baselineTime: 2,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declaring Numbers",
        content: "Create numeric variables.",
        code: "<script>\nlet age = 25;\nlet price = 9.99;\nconsole.log(age, price);\n// Output:\n// 25 9.99\n</script>",
        explanation: "Numbers can be integers or decimals (floating point).",
        type: "theory"
      },
      {
        title: "Example 2: Basic Arithmetic",
        content: "Add, subtract, multiply, divide.",
        code: "<script>\nconsole.log(age + 5);\nconsole.log(price * 2);\n// Output:\n// 30\n// 19.98\n</script>",
        explanation: "JavaScript supports standard arithmetic operators: +, -, *, /.",
        type: "theory"
      },
      {
        title: "Example 3: Increment and Decrement",
        content: "Increase or decrease numbers.",
        code: "<script>\nage++;\nconsole.log(age);\n// Output:\n// 26\n</script>",
        explanation: "The ++ operator increases a number by 1; -- decreases it by 1.",
        type: "theory"
      },
      {
        title: "Example 4: Number Type",
        content: "Check type of a variable.",
        code: "<script>\nconsole.log(typeof price);\n// Output:\n// number\n</script>",
        explanation: "typeof shows the data type of a variable.",
        type: "theory"
      },
      {
        question: "What is the data type of 42 in JavaScript?",
        options: ["string", "number", "integer", "float"],
        correctAnswer: 1,
        explanation: "JavaScript considers all numeric values as 'number' type.",
        type: "question"
      },
      {
        question: "Which operator increases a number by 1?",
        options: ["++", "--", "+=", "-="],
        correctAnswer: 0,
        explanation: "The ++ operator increments a number by 1.",
        type: "question"
      }
    ]
  }
},
{
  id: "javascript-number-methods-1",
  title: "Number Methods",
  description: "Learn how to manipulate numbers with built-in methods.",
  difficulty: "Advanced",
  baseXP: 350,
  baselineTime: 2,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: toFixed()",
        content: "Round a number to fixed decimal places.",
        code: "<script>\nconsole.log(price.toFixed(1));\n// Output:\n// 10.0\n</script>",
        explanation: "toFixed() formats a number with a specific number of decimals.",
        type: "theory"
      },
      {
        title: "Example 2: toString()",
        content: "Convert a number to a string.",
        code: "<script>\nconsole.log(age.toString());\n// Output:\n// '26'\n</script>",
        explanation: "toString() converts a number to a string.",
        type: "theory"
      },
      {
        title: "Example 3: parseInt()",
        content: "Convert a string to an integer.",
        code: "<script>\nconsole.log(parseInt('123'));\n// Output:\n// 123\n</script>",
        explanation: "parseInt() converts a string to an integer number.",
        type: "theory"
      },
      {
        title: "Example 4: parseFloat()",
        content: "Convert a string to a floating-point number.",
        code: "<script>\nconsole.log(parseFloat('12.34'));\n// Output:\n// 12.34\n</script>",
        explanation: "parseFloat() converts a string to a decimal number.",
        type: "theory"
      },
      {
        question: "Which method converts a number to a string?",
        options: ["parseInt()", "toString()", "parseFloat()", "toFixed()"],
        correctAnswer: 1,
        explanation: "toString() converts numbers to strings.",
        type: "question"
      },
      {
        question: "Which method converts a string to a decimal number?",
        options: ["parseInt()", "parseFloat()", "Number()", "toFixed()"],
        correctAnswer: 1,
        explanation: "parseFloat() converts strings to floating-point numbers.",
        type: "question"
      }
    ]
  }
},

{
  id: "javascript-math-1",
  title: "JavaScript Math",
  description: "Use Math object for advanced number operations.",
  difficulty: "Advanced",
  baseXP: 370,
  baselineTime: 2,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Math.round()",
        content: "Round a number to the nearest integer.",
        code: "<script>\nconsole.log(Math.round(4.7));\n// Output:\n// 5\n</script>",
        explanation: "Math.round() rounds numbers to the nearest integer.",
        type: "theory"
      },
      {
        title: "Example 2: Math.floor()",
        content: "Round a number down.",
        code: "<script>\nconsole.log(Math.floor(4.7));\n// Output:\n// 4\n</script>",
        explanation: "Math.floor() rounds numbers down to the nearest integer.",
        type: "theory"
      },
      {
        title: "Example 3: Math.ceil()",
        content: "Round a number up.",
        code: "<script>\nconsole.log(Math.ceil(4.1));\n// Output:\n// 5\n</script>",
        explanation: "Math.ceil() rounds numbers up to the nearest integer.",
        type: "theory"
      },
      {
        title: "Example 4: Math.random()",
        content: "Generate a random number between 0 and 1.",
        code: "<script>\nconsole.log(Math.random());\n</script>",
        explanation: "Math.random() returns a random decimal between 0 (inclusive) and 1 (exclusive).",
        type: "theory"
      },
      {
        question: "Which Math method rounds a number up?",
        options: ["Math.floor()", "Math.round()", "Math.ceil()", "Math.trunc()"],
        correctAnswer: 2,
        explanation: "Math.ceil() always rounds numbers up to the nearest integer.",
        type: "question"
      },
      {
        question: "Math.random() returns a number between which range?",
        options: ["0-1", "1-10", "0-100", "1-100"],
        correctAnswer: 0,
        explanation: "Math.random() returns a decimal number from 0 (inclusive) up to 1 (exclusive).",
        type: "question"
      }
    ]
  }
},
{
  id: "dom-intro-1",
  title: "DOM Introduction",
  description: "Learn what the DOM is and how it represents the HTML document.",
  difficulty: "Advanced",
  baseXP: 390,
  baselineTime: 2,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: What is the DOM?",
        content: "The DOM (Document Object Model) is a tree representation of the HTML document.",
        code: "<!-- HTML Example -->\n<div id='myDiv'>Hello</div>",
        explanation: "The DOM allows JavaScript to access and manipulate HTML elements.",
        type: "theory"
      },
      {
        title: "Example 2: Accessing the DOM",
        content: "You can access elements with document object.",
        code: "<script>\nconsole.log(document);\n</script>",
        explanation: "The document object represents the entire HTML page.",
        type: "theory"
      },
      {
        title: "Example 3: Nodes and Elements",
        content: "HTML elements are nodes in the DOM tree.",
        code: "<!-- HTML Example -->\n<p>Hello</p>",
        explanation: "Each HTML tag is a node in the DOM tree structure.",
        type: "theory"
      },
      {
        title: "Example 4: DOM Hierarchy",
        content: "Elements are nested inside parent elements.",
        code: "<!-- HTML Example -->\n<div><p>Text</p></div>",
        explanation: "The div is parent, and p is a child node.",
        type: "theory"
      },
      {
        question: "What does DOM stand for?",
        options: ["Document Object Model", "Data Object Model", "Document Oriented Map", "Dynamic Object Manager"],
        correctAnswer: 0,
        explanation: "DOM stands for Document Object Model.",
        type: "question"
      },
      {
        question: "Which object represents the HTML page in JavaScript?",
        options: ["window", "document", "body", "element"],
        correctAnswer: 1,
        explanation: "The document object represents the entire HTML page.",
        type: "question"
      }
    ]
  }
},
{
  id: "dom-methods-1",
  title: "DOM Methods",
  description: "Learn common methods to access elements in the DOM.",
  difficulty: "Advanced",
  baseXP: 410,
  baselineTime: 2,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: getElementById",
        content: "Access an element by its ID.",
        code: "<script>\nlet div = document.getElementById('myDiv');\nconsole.log(div.innerText);\n</script>",
        explanation: "getElementById returns the element with the specified ID.",
        type: "theory"
      },
      {
        title: "Example 2: getElementsByClassName",
        content: "Access elements by class.",
        code: "<script>\nlet items = document.getElementsByClassName('item');\nconsole.log(items.length);\n</script>",
        explanation: "Returns an HTMLCollection of all elements with the given class.",
        type: "theory"
      },
      {
        title: "Example 3: getElementsByTagName",
        content: "Access elements by tag name.",
        code: "<script>\nlet paragraphs = document.getElementsByTagName('p');\nconsole.log(paragraphs[0].innerText);\n</script>",
        explanation: "Returns an HTMLCollection of elements with the specified tag.",
        type: "theory"
      },
      {
        title: "Example 4: querySelector",
        content: "Select the first matching CSS selector.",
        code: "<script>\nlet div = document.querySelector('#myDiv');\nconsole.log(div.innerText);\n</script>",
        explanation: "querySelector allows flexible CSS-style selection.",
        type: "theory"
      },
      {
        question: "Which method returns an element by its ID?",
        options: ["getElementsByClassName", "getElementById", "querySelectorAll", "getElementsByTagName"],
        correctAnswer: 1,
        explanation: "getElementById returns a single element by ID.",
        type: "question"
      },
      {
        question: "Which method allows CSS-style selection of elements?",
        options: ["getElementById", "querySelector", "getElementsByTagName", "getElementsByClassName"],
        correctAnswer: 1,
        explanation: "querySelector uses CSS selectors to find elements.",
        type: "question"
      }
    ]
  }
},
{
  id: "dom-elements-1",
  title: "DOM Elements",
  description: "Learn how to manipulate elements and their content.",
  difficulty: "Advanced",
  baseXP: 430,
  baselineTime: 2,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Changing Text",
        content: "Modify the text inside an element.",
        code: "<script>\ndocument.getElementById('myDiv').innerText = 'Hello World!';\n</script>",
        explanation: "innerText changes the visible text of an element.",
        type: "theory"
      },
      {
        title: "Example 2: Changing HTML",
        content: "Modify HTML content of an element.",
        code: "<script>\ndocument.getElementById('myDiv').innerHTML = '<b>Bold Text</b>';\n</script>",
        explanation: "innerHTML allows embedding HTML tags inside an element.",
        type: "theory"
      },
      {
        title: "Example 3: Changing Style",
        content: "Change element styles dynamically.",
        code: "<script>\ndocument.getElementById('myDiv').style.color = 'red';\n</script>",
        explanation: "style property allows changing CSS styles of an element.",
        type: "theory"
      },
      {
        title: "Example 4: Changing Attributes",
        content: "Modify element attributes like id or class.",
        code: "<script>\ndocument.getElementById('myDiv').setAttribute('class', 'highlight');\n</script>",
        explanation: "setAttribute changes or adds a new attribute for an element.",
        type: "theory"
      },
      {
        question: "Which property changes only the visible text inside an element?",
        options: ["innerText", "innerHTML", "style", "setAttribute"],
        correctAnswer: 0,
        explanation: "innerText changes only the visible text of an element.",
        type: "question"
      },
      {
        question: "Which property allows changing CSS styles dynamically?",
        options: ["innerHTML", "innerText", "style", "setAttribute"],
        correctAnswer: 2,
        explanation: "style property allows changing an element's CSS properties.",
        type: "question"
      }
    ]
  }
},
{
  id: "dom-events-1",
  title: "DOM Events",
  description: "Learn how to respond to user actions using events.",
  difficulty: "Advanced",
  baseXP: 450,
  baselineTime: 2,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: onclick Event",
        content: "Respond to a button click.",
        code: "<button onclick=\"alert('Clicked!')\">Click Me</button>",
        explanation: "The onclick attribute executes JavaScript when the element is clicked.",
        type: "theory"
      },
      {
        title: "Example 2: onmouseover Event",
        content: "Respond to mouse hovering.",
        code: "<div onmouseover=\"this.style.color='blue'\">Hover me</div>",
        explanation: "The onmouseover event triggers when mouse moves over the element.",
        type: "theory"
      },
      {
        title: "Example 3: onmouseout Event",
        content: "Respond to mouse leaving an element.",
        code: "<div onmouseout=\"this.style.color='black'\">Hover me</div>",
        explanation: "The onmouseout event triggers when mouse leaves the element.",
        type: "theory"
      },
      {
        title: "Example 4: onchange Event",
        content: "Detect input changes.",
        code: "<input type='text' onchange=\"alert('Changed!')\">",
        explanation: "The onchange event triggers when input value is changed.",
        type: "theory"
      },
      {
        question: "Which event triggers when an input value changes?",
        options: ["onclick", "onmouseover", "onmouseout", "onchange"],
        correctAnswer: 3,
        explanation: "onchange triggers when input value is changed.",
        type: "question"
      },
      {
        question: "Which event triggers when an element is clicked?",
        options: ["onclick", "onchange", "onmouseover", "onmouseout"],
        correctAnswer: 0,
        explanation: "onclick triggers when an element is clicked.",
        type: "question"
      }
    ]
  }
},
{
  id: "dom-event-listener-1",
  title: "DOM Event Listener",
  description: "Learn the modern way to handle events using addEventListener.",
  difficulty: "Advanced",
  baseXP: 470,
  baselineTime: 2,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic Event Listener",
        content: "Attach a click event using addEventListener.",
        code: "<script>\ndocument.getElementById('myBtn').addEventListener('click', function(){\n  alert('Button clicked!');\n});\n</script>",
        explanation: "addEventListener attaches events without inline HTML attributes.",
        type: "theory"
      },
      {
        title: "Example 2: Mouseover Event",
        content: "Attach mouseover using addEventListener.",
        code: "<script>\ndocument.getElementById('myDiv').addEventListener('mouseover', function(){\n  this.style.color = 'green';\n});\n</script>",
        explanation: "addEventListener allows multiple event types on same element.",
        type: "theory"
      },
      {
        title: "Example 3: Removing Event Listeners",
        content: "Remove an event listener.",
        code: "<script>\nfunction clickHandler() {\n  alert('Clicked!');\n}\ndocument.getElementById('myBtn').addEventListener('click', clickHandler);\ndocument.getElementById('myBtn').removeEventListener('click', clickHandler);\n</script>",
        explanation: "removeEventListener removes a previously attached event.",
        type: "theory"
      },
      {
        title: "Example 4: Multiple Listeners",
        content: "Attach multiple events to same element.",
        code: "<script>\ndocument.getElementById('myBtn').addEventListener('click', ()=>alert('First'));\ndocument.getElementById('myBtn').addEventListener('click', ()=>alert('Second'));\n</script>",
        explanation: "Multiple event listeners can coexist on the same element.",
        type: "theory"
      },
      {
        question: "Which method attaches events to elements without inline HTML?",
        options: ["onclick", "addEventListener", "onchange", "onmouseover"],
        correctAnswer: 1,
        explanation: "addEventListener is the modern method to attach events.",
        type: "question"
      },
      {
        question: "Can multiple event listeners exist on the same element?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Multiple event listeners can coexist on one element.",
        type: "question"
      }
    ]
  }
},
{
  id: "js-classes-1",
  title: "JS Classes",
  description: "Learn how to define classes in JavaScript.",
  difficulty: "Advanced",
  baseXP: 490,
  baselineTime: 2,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic Class",
        content: "Define a simple class with a constructor.",
        code: "class Person {\n  constructor(name) {\n    this.name = name;\n  }\n}\nlet p = new Person('Alice');\nconsole.log(p.name);",
        explanation: "Classes allow creating objects with a constructor and methods.",
        type: "theory"
      },
      {
        title: "Example 2: Class Methods",
        content: "Add a method to the class.",
        code: "class Person {\n  constructor(name) {\n    this.name = name;\n  }\n  greet() {\n    return `Hello, ${this.name}`;\n  }\n}\nlet p = new Person('Bob');\nconsole.log(p.greet());",
        explanation: "Methods define behaviors for class instances.",
        type: "theory"
      },
      {
        title: "Example 3: Default Properties",
        content: "Set default property values.",
        code: "class Person {\n  constructor(name = 'Unknown') {\n    this.name = name;\n  }\n}\nlet p = new Person();\nconsole.log(p.name);",
        explanation: "Constructors can have default values for parameters.",
        type: "theory"
      },
      {
        title: "Example 4: Multiple Instances",
        content: "Create multiple objects from the same class.",
        code: "let p1 = new Person('Alice');\nlet p2 = new Person('Bob');\nconsole.log(p1.name, p2.name);",
        explanation: "Each instance has its own properties and methods.",
        type: "theory"
      },
      {
        question: "What keyword is used to define a class in JavaScript?",
        options: ["function", "class", "object", "new"],
        correctAnswer: 1,
        explanation: "The 'class' keyword defines a JavaScript class.",
        type: "question"
      },
      {
        question: "How do you call a method of a class instance?",
        options: ["ClassName.method()", "instance.method()", "method()", "new.method()"],
        correctAnswer: 1,
        explanation: "Methods are called on instances using instance.method().",
        type: "question"
      }
    ]
  }
},
{
  id: "js-class-inheritance-1",
  title: "JS Class Inheritance",
  description: "Learn how classes can inherit from other classes.",
  difficulty: "Advanced",
  baseXP: 510,
  baselineTime: 2,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic Inheritance",
        content: "Child class inherits from parent class.",
        code: "class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n}\nclass Dog extends Animal {}\nlet dog = new Dog('Buddy');\nconsole.log(dog.name);",
        explanation: "Child classes inherit properties and methods of the parent.",
        type: "theory"
      },
      {
        title: "Example 2: Adding Methods in Child",
        content: "Child class adds its own method.",
        code: "class Dog extends Animal {\n  bark() {\n    return 'Woof!';\n  }\n}\nlet dog = new Dog('Buddy');\nconsole.log(dog.bark());",
        explanation: "Child classes can have their own additional methods.",
        type: "theory"
      },
      {
        title: "Example 3: Overriding Methods",
        content: "Child overrides a method of parent.",
        code: "class Animal {\n  speak() { return '...'; }\n}\nclass Dog extends Animal {\n  speak() { return 'Woof!'; }\n}\nlet dog = new Dog();\nconsole.log(dog.speak());",
        explanation: "Methods in child classes can override parent methods.",
        type: "theory"
      },
      {
        title: "Example 4: super Keyword",
        content: "Call parent constructor or methods using super.",
        code: "class Dog extends Animal {\n  constructor(name, breed) {\n    super(name);\n    this.breed = breed;\n  }\n}\nlet dog = new Dog('Buddy','Beagle');\nconsole.log(dog.name, dog.breed);",
        explanation: "super calls the parent constructor or methods from child class.",
        type: "theory"
      },
      {
        question: "Which keyword allows a class to inherit another class?",
        options: ["super", "extends", "inherit", "prototype"],
        correctAnswer: 1,
        explanation: "The 'extends' keyword sets up inheritance in JavaScript.",
        type: "question"
      },
      {
        question: "Which keyword calls the parent class constructor or methods?",
        options: ["extends", "super", "this", "parent"],
        correctAnswer: 1,
        explanation: "'super' is used to call the parent constructor or methods.",
        type: "question"
      }
    ]
  }
},
{
  id: "js-modules-1",
  title: "JS Modules",
  description: "Learn how to split code into reusable modules.",
  difficulty: "Advanced",
  baseXP: 530,
  baselineTime: 2,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Exporting a Function",
        content: "Export a function from a module.",
        code: "// utils.js\nexport function greet(name){ return `Hello, ${name}`; }",
        explanation: "export allows making code available to other files.",
        type: "theory"
      },
      {
        title: "Example 2: Importing a Function",
        content: "Import a function from another module.",
        code: "// main.js\nimport { greet } from './utils.js';\nconsole.log(greet('Alice'));",
        explanation: "import brings code from other modules into current file.",
        type: "theory"
      },
      {
        title: "Example 3: Export Default",
        content: "Export a default value or function.",
        code: "// math.js\nexport default function add(a,b){ return a+b; }",
        explanation: "default export allows importing without curly braces.",
        type: "theory"
      },
      {
        title: "Example 4: Import Default",
        content: "Import a default export.",
        code: "// main.js\nimport add from './math.js';\nconsole.log(add(2,3));",
        explanation: "Default exports simplify module import syntax.",
        type: "theory"
      },
      {
        question: "Which keyword is used to make code available outside a module?",
        options: ["export", "import", "require", "module"],
        correctAnswer: 0,
        explanation: "'export' allows sharing code with other modules.",
        type: "question"
      },
      {
        question: "How do you bring code from another module?",
        options: ["import", "export", "module", "require"],
        correctAnswer: 0,
        explanation: "'import' brings code from another module into current file.",
        type: "question"
      }
    ]
  }
},
{
  id: "js-promises-1",
  title: "JS Promises",
  description: "Learn how to handle asynchronous operations using Promises.",
  difficulty: "Advanced",
  baseXP: 550,
  baselineTime: 2,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Creating a Promise",
        content: "Create a simple promise.",
        code: "let promise = new Promise((resolve, reject) => {\n  let success = true;\n  if(success) resolve('Done');\n  else reject('Error');\n});",
        explanation: "Promises represent future values or errors in async operations.",
        type: "theory"
      },
      {
        title: "Example 2: Using then",
        content: "Handle successful promise result.",
        code: "promise.then(result => console.log(result));",
        explanation: "then() handles the resolved value of a promise.",
        type: "theory"
      },
      {
        title: "Example 3: Using catch",
        content: "Handle errors from a promise.",
        code: "promise.catch(error => console.log(error));",
        explanation: "catch() handles rejected promises.",
        type: "theory"
      },
      {
        title: "Example 4: Chaining Promises",
        content: "Chain multiple then calls.",
        code: "promise.then(result => result+'!').then(msg => console.log(msg));",
        explanation: "Promises can be chained to handle multiple sequential operations.",
        type: "theory"
      },
      {
        question: "Which method handles successful promise resolution?",
        options: ["catch", "then", "finally", "resolve"],
        correctAnswer: 1,
        explanation: "then() handles the resolved value of a promise.",
        type: "question"
      },
      {
        question: "Which method handles promise rejection?",
        options: ["catch", "then", "resolve", "await"],
        correctAnswer: 0,
        explanation: "catch() is used to handle rejected promises.",
        type: "question"
      }
    ]
  }
},
{
  id: "js-async-await-1",
  title: "JS Async/Await",
  description: "Learn the modern way to handle asynchronous code.",
  difficulty: "Advanced",
  baseXP: 570,
  baselineTime: 2,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Async Function",
        content: "Define an async function that returns a promise.",
        code: "async function fetchData(){ return 'Data'; }\nfetchData().then(console.log);",
        explanation: "async functions automatically return a promise.",
        type: "theory"
      },
      {
        title: "Example 2: Await Keyword",
        content: "Use await to get the resolved value of a promise.",
        code: "async function fetchData(){ let result = await Promise.resolve('Data'); console.log(result); }\nfetchData();",
        explanation: "await pauses execution until the promise resolves.",
        type: "theory"
      },
      {
        title: "Example 3: Handling Errors",
        content: "Use try/catch with async/await.",
        code: "async function fetchData(){\n  try{\n    let result = await Promise.reject('Error');\n  } catch(e){\n    console.log(e);\n  }\n}\nfetchData();",
        explanation: "Errors can be caught with try/catch blocks.",
        type: "theory"
      },
      {
        title: "Example 4: Sequential Async Calls",
        content: "Await multiple promises one after another.",
        code: "async function fetchAll(){\n  let a = await Promise.resolve(1);\n  let b = await Promise.resolve(2);\n  console.log(a+b);\n}\nfetchAll();",
        explanation: "Multiple await calls can be executed sequentially.",
        type: "theory"
      },
      {
        question: "What keyword makes a function return a promise automatically?",
        options: ["await", "async", "then", "promise"],
        correctAnswer: 1,
        explanation: "The async keyword defines functions that return a promise.",
        type: "question"
      },
      {
        question: "Which keyword pauses execution until a promise resolves?",
        options: ["async", "await", "then", "catch"],
        correctAnswer: 1,
        explanation: "await pauses execution inside an async function until the promise resolves.",
        type: "question"
      }
    ]
  }
},
{
  id: "js-debugging-1",
  title: "JS Debugging",
  description: "Learn basic techniques for debugging JavaScript code.",
  difficulty: "Advanced",
  baseXP: 590,
  baselineTime: 2,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Using console.log",
        content: "Print variables to console for debugging.",
        code: "let x = 5;\nconsole.log('Value of x:', x);",
        explanation: "console.log() helps inspect values during execution.",
        type: "theory"
      },
      {
        title: "Example 2: Using debugger",
        content: "Pause execution at a line.",
        code: "let x = 5;\ndebugger;\nconsole.log(x);",
        explanation: "debugger pauses code execution if dev tools are open.",
        type: "theory"
      },
      {
        title: "Example 3: Inspecting Objects",
        content: "Log objects for better inspection.",
        code: "let obj = {a:1, b:2};\nconsole.log(obj);",
        explanation: "Objects can be inspected in the console for debugging.",
        type: "theory"
      },
      {
        title: "Example 4: Conditional Debugging",
        content: "Log only if condition is true.",
        code: "let x = 10;\nif(x>5) console.log('x is large');",
        explanation: "Conditional logs help reduce unnecessary output.",
        type: "theory"
      },
      {
        question: "Which tool is primarily used to debug JS in browsers?",
        options: ["console.log", "debugger", "Alerts", "DOM inspector"],
        correctAnswer: 1,
        explanation: "Debugger and browser dev tools are used to debug JavaScript.",
        type: "question"
      },
      {
        question: "What does console.log() help you do?",
        options: ["Run code", "Print variables for inspection", "Stop execution", "Create objects"],
        correctAnswer: 1,
        explanation: "console.log() helps inspect values and debug code.",
        type: "question"
      }
    ]
  }
},
{
  id: "js-best-practices-1",
  title: "JS Best Practices",
  description: "Learn simple rules for writing clean, maintainable code.",
  difficulty: "Advanced",
  baseXP: 610,
  baselineTime: 2,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Use const and let",
        content: "Prefer const for constants, let for variables.",
        code: "const pi = 3.14;\nlet radius = 5;",
        explanation: "Avoid using var; prefer block-scoped let and const.",
        type: "theory"
      },
      {
        title: "Example 2: Meaningful Names",
        content: "Use descriptive variable and function names.",
        code: "let userAge = 25;\nfunction calculateArea(radius){ return Math.PI*radius*radius; }",
        explanation: "Meaningful names improve readability.",
        type: "theory"
      },
      {
        title: "Example 3: Avoid Global Variables",
        content: "Minimize use of global scope.",
        code: "function myFunc(){ let localVar = 5; }",
        explanation: "Local variables reduce risk of conflicts and bugs.",
        type: "theory"
      },
      {
        title: "Example 4: Keep Functions Small",
        content: "Write functions with single responsibility.",
        code: "function add(a,b){ return a+b; }",
        explanation: "Small functions are easier to test and reuse.",
        type: "theory"
      },
      {
        question: "Which variable declaration should you prefer for constants?",
        options: ["var", "let", "const", "function"],
        correctAnswer: 2,
        explanation: "Use const for values that do not change.",
        type: "question"
      },
      {
        question: "Why keep functions small and focused?",
        options: ["For fun", "Easier to read, test, and reuse", "To save memory", "Avoid using variables"],
        correctAnswer: 1,
        explanation: "Small functions improve readability, testing, and reusability.",
        type: "question"
      }
    ]
  }
},
{
  id: "js-json-course-1",
  title: "JavaScript JSON Basics",
  description: "Learn how to use JSON (JavaScript Object Notation) to store, access, and manipulate data in JavaScript.",
  difficulty: "Advanced",
  baseXP: 630,
  baselineTime: 2,
  language: "javascript",
  category: "JavaScript",
  isLocked: false,
 content: {
    steps: [
      {
        title: "What is JSON?",
       content: "JSON is a lightweight format for storing and exchanging data. It's easy for humans to read and write, and easy for machines to parse.",
        code: "// Example JSON object\nlet person = {\n  \"name\": \"Alice\",\n  \"age\": 25,\n  \"isStudent\": true\n};",
       explanation: "JSON uses key-value pairs, similar to JavaScript objects.",
        type: "theory"
      },
      {
        title: "Accessing JSON Properties",
       content: "You can access values using dot notation or bracket notation.",
        code: "console.log(person.name); // Output: Alice\nconsole.log(person['age']); // Output: 25",
       explanation: "Dot notation is simpler, but bracket notation allows dynamic keys.",
        type: "theory"
      },
      {
        title: "Adding and Modifying Properties",
       content: "JSON objects can be updated by adding or changing properties.",
        code: "person.city = 'New York';\nperson.age = 26;\nconsole.log(person);",
       explanation: "You can freely modify JSON objects in JavaScript.",
        type: "theory"
      },
      {
        title: "JSON to String",
       content: "Convert JSON objects to strings to send or store them.",
        code: "let jsonString = JSON.stringify(person);\nconsole.log(jsonString);\n// Output:\n// {\"name\":\"Alice\",\"age\":26,\"isStudent\":true,\"city\":\"New York\"}",
       explanation: "JSON.stringify turns objects into JSON-formatted strings.",
        type: "theory"
      },
      {
        title: "String to JSON",
       content: "Convert JSON strings back into objects.",
        code: "let parsedObject = JSON.parse(jsonString);\nconsole.log(parsedObject.name); // Output: Alice",
       explanation: "JSON.parse allows you to work with JSON strings as JavaScript objects again.",
        type: "theory"
      },
      {
        question: "Which method converts a JavaScript object into a JSON string?",
        options: ["JSON.parse()", "JSON.stringify()", "toString()", "JSON.convert()"],
        "correctAnswer": 1,
       explanation: "Use JSON.stringify() to convert objects into JSON strings.",
        type: "question"
      },
      {
        question: "How do you access the 'age' property of the person object?",
        options: ["person.age", "person[\"age\"]", "Both A and B", "person->age"],
        correctAnswer: 2,
        explanation: "Both dot notation and bracket notation work for accessing properties.",
        type: "question"
      }
    ]
  }
}

];

export const cppLessons: Lesson[] = [
  {
  id: "cpp-intro-1",
  title: "C++ Intro & Basics",
  description: "Learn the basics of C++ including syntax, output, comments, and how to start your first program.",
  difficulty: "Beginner",
  baseXP: 50,
  baselineTime: 1,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Your First C++ Program",
        content: "Write a simple C++ program that prints a message.",
        code: "#include <iostream>\n\nint main() {\n    std::cout << \"Hello, C++ World!\" << std::endl;\n    return 0;\n}",
        explanation: "Every C++ program starts with `int main()`. `std::cout` is used to print output, and `return 0;` ends the program.",
        type: "theory"
      },
      {
        title: "Example 2: Using Comments",
        content: "Add comments to your code to explain what it does.",
        code: "#include <iostream>\n\nint main() {\n    // This prints a greeting message\n    std::cout << \"Hello, C++!\" << std::endl;\n    return 0;\n}",
        explanation: "Single-line comments start with `//`. They are ignored by the compiler but help explain the code.",
        type: "theory"
      },
      {
        title: "Example 3: Understanding Syntax",
        content: "Learn the basic structure and rules of C++ code.",
        code: "#include <iostream>\n\nint main() {\n    int number = 10; // Declare a variable\n    std::cout << \"Number: \" << number << std::endl;\n    return 0;\n}",
        explanation: "C++ statements end with a semicolon `;`. Braces `{}` define the start and end of code blocks.",
        type: "theory"
      },
      {
        title: "Example 4: Output and New Lines",
        content: "Print multiple lines using `std::endl`.",
        code: "#include <iostream>\n\nint main() {\n    std::cout << \"Line 1\" << std::endl;\n    std::cout << \"Line 2\" << std::endl;\n    return 0;\n}",
        explanation: "`std::endl` moves the cursor to the next line. You can also use `\\n` for new lines.",
        type: "theory"
      },
      {
        question: "Which object is used to print output to the console in C++?",
        options: ["std::cin", "std::cout", "printf", "Console.WriteLine"],
        correctAnswer: 1,
        explanation: "std::cout is the standard object to print output in C++.",
        type: "question"
      },
      {
        question: "What symbol is used for single-line comments in C++?",
        options: ["#", "//", "/*", "--"],
        correctAnswer: 1,
        explanation: "Single-line comments start with `//` in C++.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-getstarted",
  title: "C++ Get Started",
  description: "Learn how to start a C++ program and understand the basic structure.",
  difficulty: "Beginner",
  baseXP: 55,
  baselineTime: 1,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: First Program",
        content: "Write a simple program that prints a message.",
        code: "#include <iostream>\n\nint main() {\n    std::cout << \"Hello, C++ World!\" << std::endl;\n    return 0;\n}",
        explanation: "Every C++ program starts with `int main()`. `std::cout` prints output, `return 0;` ends the program.",
        type: "theory"
      },
      {
        title: "Example 2: Compiling & Running",
        content: "Compile and run your first C++ program using a compiler.",
        code: "// No code needed, just use:\n// g++ main.cpp -o main\n// ./main",
        explanation: "C++ programs must be compiled before running. `g++` is a common compiler.",
        type: "theory"
      },
      {
        title: "Example 3: Program Structure",
        content: "Understand the key parts: headers, main function, and statements.",
        code: "#include <iostream>\n\nint main() {\n    int x = 5;\n    std::cout << x << std::endl;\n    return 0;\n}",
        explanation: "Headers include libraries, main() is the entry point, and statements end with a semicolon.",
        type: "theory"
      },
      {
        title: "Example 4: Basic Comments",
        content: "Add a comment to your program.",
        code: "#include <iostream>\n\nint main() {\n    // Print a number\n    std::cout << 10 << std::endl;\n    return 0;\n}",
        explanation: "Comments explain your code and are ignored by the compiler.",
        type: "theory"
      },
      {
        question: "Which function is the starting point of every C++ program?",
        options: ["start()", "main()", "begin()", "init()"],
        correctAnswer: 1,
        explanation: "`main()` is the entry point of every C++ program.",
        type: "question"
      },
      {
        question: "What does `return 0;` signify in C++?",
        options: ["Program ended with error", "Program ended successfully", "Variable declaration", "Function call"],
        correctAnswer: 1,
        explanation: "`return 0;` indicates the program ended successfully.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-syntax",
  title: "C++ Syntax",
  description: "Learn basic C++ syntax rules including semicolons, braces, and case sensitivity.",
  difficulty: "Beginner",
  baseXP: 60,
  baselineTime: 1,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Semicolons",
        content: "End every statement with a semicolon.",
        code: "#include <iostream>\n\nint main() {\n    int x = 5;\n    std::cout << x << std::endl;\n    return 0;\n}",
        explanation: "Semicolons mark the end of a statement in C++.",
        type: "theory"
      },
      {
        title: "Example 2: Braces",
        content: "Use braces to define code blocks.",
        code: "#include <iostream>\n\nint main() {\n    {\n        int y = 10;\n        std::cout << y << std::endl;\n    }\n    return 0;\n}",
        explanation: "Braces `{}` group multiple statements into a block.",
        type: "theory"
      },
      {
        title: "Example 3: Case Sensitivity",
        content: "C++ is case-sensitive.",
        code: "#include <iostream>\n\nint main() {\n    int number = 7;\n    std::cout << number << std::endl;\n    return 0;\n}",
        explanation: "C++ treats `number` and `Number` as different identifiers.",
        type: "theory"
      },
      {
        title: "Example 4: Whitespace",
        content: "Spaces and line breaks improve readability but don’t affect execution.",
        code: "#include <iostream>\n\nint main() {\n    int a = 5;\n    int b = 10;\n    std::cout << a + b << std::endl;\n    return 0;\n}",
        explanation: "Whitespace makes code easier to read. It doesn’t change program behavior.",
        type: "theory"
      },
      {
        question: "Which of the following is true about C++ syntax?",
        options: ["Semicolons are optional", "Braces define code blocks", "C++ ignores case", "Whitespace is required between statements"],
        correctAnswer: 1,
        explanation: "Braces `{}` are used to define code blocks in C++.",
        type: "question"
      },
      {
        question: "What will happen if you forget a semicolon at the end of a statement?",
        options: ["Nothing", "Compilation error", "Program runs partially", "Prints a warning only"],
        correctAnswer: 1,
        explanation: "Forgetting a semicolon causes a compilation error.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-output",
  title: "C++ Output",
  description: "Learn how to display messages and variable values in C++ using std::cout.",
  difficulty: "Beginner",
  baseXP: 65,
  baselineTime: 1,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Print Text",
        content: "Display a simple message to the console.",
        code: "#include <iostream>\n\nint main() {\n    std::cout << \"Hello, C++!\" << std::endl;\n    return 0;\n}",
        explanation: "`std::cout` prints text. `<< std::endl` adds a new line.",
        type: "theory"
      },
      {
        title: "Example 2: Print Variables",
        content: "Show the value of a variable on the console.",
        code: "#include <iostream>\n\nint main() {\n    int age = 20;\n    std::cout << \"Age: \" << age << std::endl;\n    return 0;\n}",
        explanation: "You can combine text and variables using `<<` to print both in the same line.",
        type: "theory"
      },
      {
        title: "Example 3: Print Expressions",
        content: "Print the result of a calculation directly.",
        code: "#include <iostream>\n\nint main() {\n    std::cout << \"5 + 3 = \" << 5 + 3 << std::endl;\n    return 0;\n}",
        explanation: "You can print expressions; C++ evaluates them before printing.",
        type: "theory"
      },
      {
        title: "Example 4: Multiple Outputs",
        content: "Print multiple pieces of information on one line.",
        code: "#include <iostream>\n\nint main() {\n    int a = 5, b = 10;\n    std::cout << \"a = \" << a << \", b = \" << b << std::endl;\n    return 0;\n}",
        explanation: "Use multiple `<<` operators to chain outputs in a single statement.",
        type: "theory"
      },
      {
        question: "Which operator is used with std::cout to print text and variables?",
        options: ["<<", ">>", "=", "+"],
        correctAnswer: 0,
        explanation: "The `<<` operator is used with `std::cout` to output text and variables.",
        type: "question"
      },
      {
        question: "What does `std::endl` do in a cout statement?",
        options: ["Adds a new line", "Ends the program", "Prints the value of a variable", "Creates a comment"],
        correctAnswer: 0,
        explanation: "`std::endl` moves the cursor to a new line in the console output.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-comments",
  title: "C++ Comments",
  description: "Learn how to add single-line and multi-line comments to your C++ programs.",
  difficulty: "Beginner",
  baseXP: 70,
  baselineTime: 1,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Single-Line Comment",
        content: "Explain code using a single-line comment.",
        code: "#include <iostream>\n\nint main() {\n    // This prints a greeting\n    std::cout << \"Hello!\" << std::endl;\n    return 0;\n}",
        explanation: "Single-line comments start with `//` and are ignored by the compiler.",
        type: "theory"
      },
      {
        title: "Example 2: Multi-Line Comment",
        content: "Use multi-line comments to explain multiple lines of code.",
        code: "#include <iostream>\n\nint main() {\n    /* This program prints a greeting\n       and shows how multi-line comments work */\n    std::cout << \"Hello, World!\" << std::endl;\n    return 0;\n}",
        explanation: "Multi-line comments start with `/*` and end with `*/`.",
        type: "theory"
      },
      {
        title: "Example 3: Commenting Out Code",
        content: "Temporarily disable a line of code using comments.",
        code: "#include <iostream>\n\nint main() {\n    // std::cout << \"This won't print\" << std::endl;\n    std::cout << \"This will print\" << std::endl;\n    return 0;\n}",
        explanation: "Comments can be used to prevent code from executing temporarily.",
        type: "theory"
      },
      {
        title: "Example 4: Inline Comment",
        content: "Add a comment at the end of a statement.",
        code: "#include <iostream>\n\nint main() {\n    int x = 10; // Variable x stores the value 10\n    std::cout << x << std::endl;\n    return 0;\n}",
        explanation: "Comments can be placed inline after code to describe it.",
        type: "theory"
      },
      {
        question: "Which of the following is a correct single-line comment in C++?",
        options: ["// comment", "/* comment */", "# comment", "<!-- comment -->"],
        correctAnswer: 0,
        explanation: "Single-line comments in C++ start with `//`.",
        type: "question"
      },
      {
        question: "Which symbol is used to start a multi-line comment?",
        options: ["/*", "//", "#", "<!--"],
        correctAnswer: 0,
        explanation: "Multi-line comments start with `/*` and end with `*/` in C++.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-variables",
  title: "C++ Variables",
  description: "Learn how to declare and use variables in C++.",
  difficulty: "Beginner",
  baseXP: 75,
  baselineTime: 1,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declaring Variables",
        content: "Declare an integer and a float variable.",
        code: "#include <iostream>\n\nint main() {\n    int age = 25;\n    float height = 5.9;\n    std::cout << age << \", \" << height << std::endl;\n    return 0;\n}",
        explanation: "Variables store data values. The type defines what kind of data it holds.",
        type: "theory"
      },
      {
        title: "Example 2: Changing Variable Values",
        content: "Update the value of a variable after declaration.",
        code: "#include <iostream>\n\nint main() {\n    int score = 10;\n    score = 20;\n    std::cout << score << std::endl;\n    return 0;\n}",
        explanation: "You can change the value of a variable after it has been declared.",
        type: "theory"
      },
      {
        title: "Example 3: Multiple Declarations",
        content: "Declare multiple variables of the same type in one line.",
        code: "#include <iostream>\n\nint main() {\n    int x = 5, y = 10, z = 15;\n    std::cout << x << \", \" << y << \", \" << z << std::endl;\n    return 0;\n}",
        explanation: "You can declare several variables of the same type in a single statement.",
        type: "theory"
      },
      {
        title: "Example 4: Constants",
        content: "Declare a constant variable that cannot be changed.",
        code: "#include <iostream>\n\nint main() {\n    const double PI = 3.14159;\n    std::cout << PI << std::endl;\n    return 0;\n}",
        explanation: "Constants hold values that cannot be modified after initialization.",
        type: "theory"
      },
      {
        question: "Which keyword is used to declare a constant in C++?",
        options: ["const", "var", "let", "static"],
        correctAnswer: 0,
        explanation: "The `const` keyword declares a constant whose value cannot be changed.",
        type: "question"
      },
      {
        question: "Can you change the value of a normal variable after declaration?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Normal variables can be updated after they are declared.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-data-types",
  title: "C++ Data Types",
  description: "Learn the basic data types in C++ and how to use them.",
  difficulty: "Beginner",
  baseXP: 80,
  baselineTime: 1,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Integer and Float",
        content: "Declare integer and float variables.",
        code: "#include <iostream>\n\nint main() {\n    int age = 25;\n    float height = 5.9;\n    std::cout << age << \", \" << height << std::endl;\n    return 0;\n}",
        explanation: "int stores whole numbers, float stores decimal numbers.",
        type: "theory"
      },
      {
        title: "Example 2: Double and Char",
        content: "Declare double and char variables.",
        code: "#include <iostream>\n\nint main() {\n    double pi = 3.14159;\n    char grade = 'A';\n    std::cout << pi << \", \" << grade << std::endl;\n    return 0;\n}",
        explanation: "double stores larger decimal numbers, char stores single characters.",
        type: "theory"
      },
      {
        title: "Example 3: Boolean",
        content: "Use a boolean variable to store true/false.",
        code: "#include <iostream>\n\nint main() {\n    bool isPassed = true;\n    std::cout << isPassed << std::endl;\n    return 0;\n}",
        explanation: "bool can only store `true` or `false`.",
        type: "theory"
      },
      {
        title: "Example 4: String",
        content: "Use string variables to store text.",
        code: "#include <iostream>\n#include <string>\n\nint main() {\n    std::string name = \"Alice\";\n    std::cout << name << std::endl;\n    return 0;\n}",
        explanation: "std::string stores sequences of characters (words, sentences).",
        type: "theory"
      },
      {
        question: "Which type is used to store true/false values?",
        options: ["int", "bool", "char", "string"],
        correctAnswer: 1,
        explanation: "`bool` stores boolean values: true or false.",
        type: "question"
      },
      {
        question: "Which data type is best for storing text?",
        options: ["char", "string", "int", "float"],
        correctAnswer: 1,
        explanation: "`std::string` is used to store sequences of characters (text).",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-operators",
  title: "C++ Operators",
  description: "Learn the basic arithmetic, assignment, and comparison operators in C++.",
  difficulty: "Beginner",
  baseXP: 85,
  baselineTime: 1,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Arithmetic Operators",
        content: "Perform addition, subtraction, multiplication, and division.",
        code: "#include <iostream>\n\nint main() {\n    int a = 10, b = 5;\n    std::cout << a + b << \", \" << a - b << \", \" << a * b << \", \" << a / b << std::endl;\n    return 0;\n}",
        explanation: "C++ uses +, -, *, / for basic arithmetic.",
        type: "theory"
      },
      {
        title: "Example 2: Modulus Operator",
        content: "Get the remainder of division.",
        code: "#include <iostream>\n\nint main() {\n    int a = 10, b = 3;\n    std::cout << a % b << std::endl;\n    return 0;\n}",
        explanation: "`%` returns the remainder of integer division.",
        type: "theory"
      },
      {
        title: "Example 3: Assignment Operators",
        content: "Use assignment operators to update variables.",
        code: "#include <iostream>\n\nint main() {\n    int x = 5;\n    x += 3; // equivalent to x = x + 3\n    std::cout << x << std::endl;\n    return 0;\n}",
        explanation: "Assignment operators like `+=`, `-=`, `*=`, `/=` modify the variable.",
        type: "theory"
      },
      {
        title: "Example 4: Comparison Operators",
        content: "Compare values using ==, !=, <, >, <=, >=.",
        code: "#include <iostream>\n\nint main() {\n    int a = 5, b = 10;\n    std::cout << (a == b) << \", \" << (a != b) << std::endl;\n    return 0;\n}",
        explanation: "Comparison operators return true (1) or false (0).",
        type: "theory"
      },
      {
        question: "Which operator gives the remainder of integer division?",
        options: ["%", "/", "*", "+"],
        correctAnswer: 0,
        explanation: "`%` is the modulus operator, which returns the remainder.",
        type: "question"
      },
      {
        question: "Which comparison operator checks equality?",
        options: ["=", "==", "!=", ">="],
        correctAnswer: 1,
        explanation: "`==` checks whether two values are equal.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-strings",
  title: "C++ Strings",
  description: "Learn how to use string variables and operations in C++.",
  difficulty: "Beginner",
  baseXP: 90,
  baselineTime: 1,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declare a String",
        content: "Store text in a string variable.",
        code: "#include <iostream>\n#include <string>\n\nint main() {\n    std::string name = \"Alice\";\n    std::cout << name << std::endl;\n    return 0;\n}",
        explanation: "`std::string` is used to store sequences of characters.",
        type: "theory"
      },
      {
        title: "Example 2: Concatenate Strings",
        content: "Join two strings together.",
        code: "#include <iostream>\n#include <string>\n\nint main() {\n    std::string first = \"Hello, \";\n    std::string last = \"World!\";\n    std::string full = first + last;\n    std::cout << full << std::endl;\n    return 0;\n}",
        explanation: "The `+` operator concatenates strings.",
        type: "theory"
      },
      {
        title: "Example 3: String Length",
        content: "Get the number of characters in a string.",
        code: "#include <iostream>\n#include <string>\n\nint main() {\n    std::string text = \"Hello\";\n    std::cout << text.length() << std::endl;\n    return 0;\n}",
        explanation: "The `length()` method returns the number of characters in a string.",
        type: "theory"
      },
      {
        title: "Example 4: Access Characters",
        content: "Access individual characters in a string using index.",
        code: "#include <iostream>\n#include <string>\n\nint main() {\n    std::string text = \"Hello\";\n    std::cout << text[0] << std::endl;\n    return 0;\n}",
        explanation: "Strings can be treated like arrays of characters using index notation.",
        type: "theory"
      },
      {
        question: "Which operator is used to combine two strings?",
        options: ["+", "-", "*", "&"],
        correctAnswer: 0,
        explanation: "The `+` operator concatenates (joins) two strings.",
        type: "question"
      },
      {
        question: "How do you get the length of a string `s`?",
        options: ["s.size()", "s.length()", "Both A and B", "None"],
        correctAnswer: 2,
        explanation: "Both `s.size()` and `s.length()` return the number of characters in a string.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-math",
  title: "C++ Math",
  description: "Learn how to use mathematical operations and functions in C++.",
  difficulty: "Beginner",
  baseXP: 95,
  baselineTime: 1,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic Arithmetic",
        content: "Perform addition, subtraction, multiplication, and division.",
        code: "#include <iostream>\n\nint main() {\n    int a = 10, b = 3;\n    std::cout << a + b << \", \" << a - b << \", \" << a * b << \", \" << a / b << std::endl;\n    return 0;\n}",
        explanation: "Basic arithmetic operators: +, -, *, /",
        type: "theory"
      },
      {
        title: "Example 2: Using Modulus",
        content: "Get the remainder of integer division.",
        code: "#include <iostream>\n\nint main() {\n    int a = 10, b = 3;\n    std::cout << a % b << std::endl;\n    return 0;\n}",
        explanation: "`%` returns remainder of division for integers.",
        type: "theory"
      },
      {
        title: "Example 3: Using cmath Functions",
        content: "Use math functions like sqrt, pow, and abs.",
        code: "#include <iostream>\n#include <cmath>\n\nint main() {\n    std::cout << sqrt(16) << \", \" << pow(2,3) << \", \" << abs(-5) << std::endl;\n    return 0;\n}",
        explanation: "C++ `cmath` library provides common math functions.",
        type: "theory"
      },
      {
        question: "Which function calculates the square root of a number?",
        options: ["pow()", "sqrt()", "abs()", "log()"],
        correctAnswer: 1,
        explanation: "`sqrt()` computes the square root.",
        type: "question"
      },
      {
        question: "Which library must you include to use sqrt()?",
        options: ["<string>", "<cmath>", "<vector>", "<iostream>"],
        correctAnswer: 1,
        explanation: "The `<cmath>` library provides mathematical functions.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-booleans",
  title: "C++ Booleans",
  description: "Learn how to use boolean values and logical operators in C++.",
  difficulty: "Beginner",
  baseXP: 100,
  baselineTime: 1,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Boolean Variables",
        content: "Declare boolean variables to store true/false values.",
        code: "#include <iostream>\n\nint main() {\n    bool isRaining = true;\n    bool isSunny = false;\n    std::cout << isRaining << \", \" << isSunny << std::endl;\n    return 0;\n}",
        explanation: "Boolean variables store either true (1) or false (0).",
        type: "theory"
      },
      {
        title: "Example 2: Logical AND (&&)",
        content: "Use && to check if both conditions are true.",
        code: "#include <iostream>\n\nint main() {\n    bool a = true, b = false;\n    std::cout << (a && b) << std::endl;\n    return 0;\n}",
        explanation: "`&&` returns true only if both operands are true.",
        type: "theory"
      },
      {
        title: "Example 3: Logical OR (||)",
        content: "Use || to check if at least one condition is true.",
        code: "#include <iostream>\n\nint main() {\n    bool a = true, b = false;\n    std::cout << (a || b) << std::endl;\n    return 0;\n}",
        explanation: "`||` returns true if at least one operand is true.",
        type: "theory"
      },
      {
        title: "Example 4: Logical NOT (!)",
        content: "Use ! to invert a boolean value.",
        code: "#include <iostream>\n\nint main() {\n    bool a = true;\n    std::cout << !a << std::endl;\n    return 0;\n}",
        explanation: "`!` inverts true to false and false to true.",
        type: "theory"
      },
      {
        question: "Which operator represents logical AND?",
        options: ["&&", "||", "!", "&"],
        correctAnswer: 0,
        explanation: "`&&` is the logical AND operator.",
        type: "question"
      },
      {
        question: "What is the output of !true in C++?",
        options: ["true", "false", "1", "0"],
        correctAnswer: 1,
        explanation: "`!true` evaluates to false.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-user-input",
  title: "C++ User Input",
  description: "Learn how to take input from users using std::cin.",
  difficulty: "Beginner",
  baseXP: 105,
  baselineTime: 1,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Input an Integer",
        content: "Take an integer from the user.",
        code: "#include <iostream>\n\nint main() {\n    int age;\n    std::cout << \"Enter your age: \";\n    std::cin >> age;\n    std::cout << \"You entered: \" << age << std::endl;\n    return 0;\n}",
        explanation: "`std::cin` reads input from the user and stores it in a variable.",
        type: "theory"
      },
      {
        title: "Example 2: Input Multiple Values",
        content: "Take multiple inputs in one line.",
        code: "#include <iostream>\n\nint main() {\n    int a, b;\n    std::cout << \"Enter two numbers: \";\n    std::cin >> a >> b;\n    std::cout << \"Sum: \" << a + b << std::endl;\n    return 0;\n}",
        explanation: "You can take multiple inputs using `>>` operators sequentially.",
        type: "theory"
      },
      {
        title: "Example 3: Input a String",
        content: "Take a single-word string input.",
        code: "#include <iostream>\n#include <string>\n\nint main() {\n    std::string name;\n    std::cout << \"Enter your name: \";\n    std::cin >> name;\n    std::cout << \"Hello, \" << name << std::endl;\n    return 0;\n}",
        explanation: "`std::cin` can also read string inputs (without spaces) into a variable.",
        type: "theory"
      },
      {
        title: "Example 4: Using getline() for Full Lines",
        content: "Take full line input including spaces.",
        code: "#include <iostream>\n#include <string>\n\nint main() {\n    std::string fullName;\n    std::cout << \"Enter your full name: \";\n    std::getline(std::cin, fullName);\n    std::cout << \"Hello, \" << fullName << std::endl;\n    return 0;\n}",
        explanation: "`std::getline` reads an entire line including spaces, unlike `std::cin`.",
        type: "theory"
      },
      {
        question: "Which function is used to read a full line of text including spaces?",
        options: ["std::cin", "std::getline", "cin.getline", "scanf"],
        correctAnswer: 1,
        explanation: "`std::getline` is used to read an entire line including spaces.",
        type: "question"
      },
      {
        question: "Which operator is used with std::cin to take input into a variable?",
        options: ["<<", ">>", "==", "="],
        correctAnswer: 1,
        explanation: "The `>>` operator is used with `std::cin` to store user input into a variable.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-if-else",
  title: "C++ If...Else",
  description: "Learn how to execute code conditionally using if, else if, and else statements.",
  difficulty: "Beginner",
  baseXP: 110,
  baselineTime: 1,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Positive or Negative",
        content: "Check if a number is positive or negative.",
        code: "#include <iostream>\n\nint main() {\n    int x;\n    std::cout << \"Enter a number: \";\n    std::cin >> x;\n\n    if(x > 0) {\n        std::cout << \"Positive\" << std::endl;\n    } else {\n        std::cout << \"Negative\" << std::endl;\n    }\n    return 0;\n}",
        explanation: "`if` runs when the condition is true; `else` runs when it's false.",
        type: "theory"
      },
      {
        title: "Example 2: Even or Odd",
        content: "Determine whether a number is even or odd using modulo operator.",
        code: "#include <iostream>\n\nint main() {\n    int x;\n    std::cout << \"Enter a number: \";\n    std::cin >> x;\n\n    if(x % 2 == 0) {\n        std::cout << \"Even\" << std::endl;\n    } else {\n        std::cout << \"Odd\" << std::endl;\n    }\n    return 0;\n}",
        explanation: "x % 2 gives the remainder. 0 → even, else → odd.",
        type: "theory"
      },
      {
        title: "Example 3: Multiple Conditions",
        content: "Check if a number is positive, negative, or zero.",
        code: "#include <iostream>\n\nint main() {\n    int x;\n    std::cout << \"Enter a number: \";\n    std::cin >> x;\n\n    if(x > 0) {\n        std::cout << \"Positive\" << std::endl;\n    } else if(x < 0) {\n        std::cout << \"Negative\" << std::endl;\n    } else {\n        std::cout << \"Zero\" << std::endl;\n    }\n    return 0;\n}",
        explanation: "`else if` checks additional conditions after the first `if`.",
        type: "theory"
      },
      {
        title: "Example 4: Grade Check",
        content: "Assign a letter grade based on score ranges.",
        code: "#include <iostream>\n\nint main() {\n    int score;\n    std::cout << \"Enter score: \";\n    std::cin >> score;\n\n    if(score >= 90) {\n        std::cout << \"A\" << std::endl;\n    } else if(score >= 75) {\n        std::cout << \"B\" << std::endl;\n    } else {\n        std::cout << \"C\" << std::endl;\n    }\n    return 0;\n}",
        explanation: "Use multiple `else if` statements to handle ranges of values.",
        type: "theory"
      },
      {
        question: "What output will the multiple conditions example give if x = 0?",
        options: ["Positive", "Negative", "Zero", "Error"],
        correctAnswer: 2,
        explanation: "x = 0 triggers the `else` block, so output is Zero.",
        type: "question"
      },
      {
        question: "Which statement checks additional conditions after an if?",
        options: ["else", "else if", "switch", "for"],
        correctAnswer: 1,
        explanation: "`else if` allows checking another condition if the first `if` is false.",
        type: "question"
      }
    ]
  }
},

{
  id: "cpp-switch",
  title: "C++ Switch",
  description: "Execute code based on discrete integer or character values using switch-case statements.",
  difficulty: "Beginner",
  baseXP: 115,
  baselineTime: 1,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Day of the Week",
        content: "Print the day name based on a number from 1 to 7.",
        code: "#include <iostream>\n\nint main() {\n    int day;\n    std::cout << \"Enter day number (1-7): \";\n    std::cin >> day;\n\n    switch(day) {\n        case 1: std::cout << \"Monday\"; break;\n        case 2: std::cout << \"Tuesday\"; break;\n        case 3: std::cout << \"Wednesday\"; break;\n        default: std::cout << \"Other day\";\n    }\n    return 0;\n}",
        explanation: "Each `case` executes if its value matches. `break` stops fall-through.",
        type: "theory"
      },
      {
        title: "Example 2: Simple Calculator",
        content: "Perform basic arithmetic based on a character input (+, -, *, /).",
        code: "#include <iostream>\n\nint main() {\n    char op;\n    int a = 5, b = 3;\n    std::cout << \"Enter operation (+,-,*,/): \";\n    std::cin >> op;\n\n    switch(op) {\n        case '+': std::cout << a+b; break;\n        case '-': std::cout << a-b; break;\n        case '*': std::cout << a*b; break;\n        case '/': std::cout << a/b; break;\n        default: std::cout << \"Invalid operation\";\n    }\n    return 0;\n}",
        explanation: "Switch can be used with char values as well as integers.",
        type: "theory"
      },
      {
        title: "Example 3: Grade Mapping",
        content: "Map numeric score to letter grade using integer division.",
        code: "#include <iostream>\n\nint main() {\n    int score = 90;\n    int grade = score/10;\n\n    switch(grade) {\n        case 10:\n        case 9: std::cout << \"A\"; break;\n        case 8: std::cout << \"B\"; break;\n        default: std::cout << \"C\";\n    }\n    return 0;\n}",
        explanation: "Multiple cases can share the same code block (fall-through).",
        type: "theory"
      },
      {
        title: "Example 4: Menu Selection",
        content: "Select an option from a simple menu.",
        code: "#include <iostream>\n\nint main() {\n    int choice;\n    std::cout << \"Choose 1 or 2: \";\n    std::cin >> choice;\n\n    switch(choice) {\n        case 1: std::cout << \"Option 1 selected\"; break;\n        case 2: std::cout << \"Option 2 selected\"; break;\n        default: std::cout << \"Invalid choice\";\n    }\n    return 0;\n}",
        explanation: "Default handles any value not listed in cases.",
        type: "theory"
      },
      {
        question: "What happens if `break` is removed from a case?",
        options: ["Only that case runs", "Fall-through occurs", "Program crashes", "Switch ignored"],
        correctAnswer: 1,
        explanation: "Without `break`, execution continues to the next case until a break or the switch ends.",
        type: "question"
      },
      {
        question: "Which data types are valid in a switch statement?",
        options: ["Integer and char", "Float", "String", "All types"],
        correctAnswer: 0,
        explanation: "Switch works with integer or char values, not floats or strings.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-while-loop",
  title: "C++ While Loop",
  description: "Repeat code while a condition is true using the while loop.",
  difficulty: "Beginner",
  baseXP: 120,
  baselineTime: 1,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Print numbers 1 to 5",
        content: "Use while loop to print numbers from 1 to 5.",
        code: "#include <iostream>\n\nint main() {\n    int i = 1;\n    while(i <= 5) {\n        std::cout << i << std::endl;\n        i++;\n    }\n    return 0;\n}",
        explanation: "The loop continues as long as the condition (i <= 5) is true.",
        type: "theory"
      },
      {
        title: "Example 2: Sum of numbers",
        content: "Calculate sum of numbers from 1 to 10.",
        code: "#include <iostream>\n\nint main() {\n    int i = 1, sum = 0;\n    while(i <= 10) {\n        sum += i;\n        i++;\n    }\n    std::cout << \"Sum: \" << sum;\n    return 0;\n}",
        explanation: "Use a counter variable and update it inside the while loop.",
        type: "theory"
      },
      {
        title: "Example 3: User input until zero",
        content: "Keep asking user for numbers until 0 is entered.",
        code: "#include <iostream>\n\nint main() {\n    int x;\n    std::cout << \"Enter number (0 to stop): \";\n    std::cin >> x;\n\n    while(x != 0) {\n        std::cout << \"You entered: \" << x << std::endl;\n        std::cin >> x;\n    }\n    return 0;\n}",
        explanation: "Loop continues until the user enters a stopping value (0).",
        type: "theory"
      },
      {
        title: "Example 4: Multiples of 3",
        content: "Print all multiples of 3 less than 20.",
        code: "#include <iostream>\n\nint main() {\n    int i = 3;\n    while(i < 20) {\n        std::cout << i << \" \";\n        i += 3;\n    }\n    return 0;\n}",
        explanation: "Increment by 3 each iteration to print multiples of 3.",
        type: "theory"
      },
      {
        question: "What will happen if the condition in while is always true?",
        options: ["Loop runs once", "Infinite loop occurs", "Program crashes", "Loop is skipped"],
        correctAnswer: 1,
        explanation: "A true condition forever causes an infinite loop until stopped manually.",
        type: "question"
      },
      {
        question: "Which part of the while loop is mandatory?",
        options: ["Initialization", "Condition", "Increment", "All of the above"],
        correctAnswer: 1,
        explanation: "The condition determines whether the loop executes. Initialization and increment are usually needed but not mandatory.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-for-loop",
  title: "C++ For Loop",
  description: "Repeat code a fixed number of times using the for loop.",
  difficulty: "Beginner",
  baseXP: 125,
  baselineTime: 1,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Print numbers 1 to 5",
        content: "Use for loop to print numbers 1 to 5.",
        code: "#include <iostream>\n\nint main() {\n    for(int i = 1; i <= 5; i++) {\n        std::cout << i << std::endl;\n    }\n    return 0;\n}",
        explanation: "for loop combines initialization, condition, and increment in one line.",
        type: "theory"
      },
      {
        title: "Example 2: Sum of numbers",
        content: "Calculate sum of numbers from 1 to 10 using for loop.",
        code: "#include <iostream>\n\nint main() {\n    int sum = 0;\n    for(int i = 1; i <= 10; i++) {\n        sum += i;\n    }\n    std::cout << \"Sum: \" << sum;\n    return 0;\n}",
        explanation: "Use a for loop to iterate over a known range of numbers.",
        type: "theory"
      },
      {
        title: "Example 3: Multiplication table",
        content: "Print multiplication table of 5.",
        code: "#include <iostream>\n\nint main() {\n    for(int i = 1; i <= 10; i++) {\n        std::cout << \"5 x \" << i << \" = \" << 5*i << std::endl;\n    }\n    return 0;\n}",
        explanation: "for loops are ideal for repeated actions over a fixed number of iterations.",
        type: "theory"
      },
      {
        title: "Example 4: Decrementing loop",
        content: "Print numbers 5 to 1 using a decrementing for loop.",
        code: "#include <iostream>\n\nint main() {\n    for(int i = 5; i >= 1; i--) {\n        std::cout << i << \" \";\n    }\n    return 0;\n}",
        explanation: "for loops can decrement values by changing the increment section to i--.",
        type: "theory"
      },
      {
        question: "Which part of the for loop executes first?",
        options: ["Condition", "Increment", "Initialization", "Body"],
        correctAnswer: 2,
        explanation: "Initialization runs first, then the loop checks the condition.",
        type: "question"
      },
      {
        question: "Which loop is better when the number of iterations is known?",
        options: ["while", "for", "if", "switch"],
        correctAnswer: 1,
        explanation: "for loops are ideal when iteration count is predetermined.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-break-continue",
  title: "C++ Break / Continue",
  description: "Control loop execution using break and continue statements.",
  difficulty: "Intermediate",
  baseXP: 140,
  baselineTime: 1.5,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Break in loop",
        content: "Stop a loop when a number equals 3.",
        code: "#include <iostream>\n\nint main() {\n    for(int i = 1; i <= 5; i++) {\n        if(i == 3) break;\n        std::cout << i << \" \";\n    }\n    return 0;\n}",
        explanation: "`break` immediately exits the loop.",
        type: "theory"
      },
      {
        title: "Example 2: Continue in loop",
        content: "Skip printing number 3 in a loop.",
        code: "#include <iostream>\n\nint main() {\n    for(int i = 1; i <= 5; i++) {\n        if(i == 3) continue;\n        std::cout << i << \" \";\n    }\n    return 0;\n}",
        explanation: "`continue` skips the rest of the loop body for that iteration and moves to the next.",
        type: "theory"
      },
      {
        title: "Example 3: Break in while loop",
        content: "Stop taking input if user enters 0.",
        code: "#include <iostream>\n\nint main() {\n    int x;\n    while(true) {\n        std::cin >> x;\n        if(x == 0) break;\n        std::cout << \"You entered: \" << x << std::endl;\n    }\n    return 0;\n}",
        explanation: "`break` works in any loop (for, while, do-while).",
        type: "theory"
      },
      {
        title: "Example 4: Continue with condition",
        content: "Print only odd numbers from 1 to 5.",
        code: "#include <iostream>\n\nint main() {\n    for(int i = 1; i <= 5; i++) {\n        if(i % 2 == 0) continue;\n        std::cout << i << \" \";\n    }\n    return 0;\n}",
        explanation: "`continue` can be used to skip unwanted iterations based on a condition.",
        type: "theory"
      },
      {
        question: "What is the main difference between break and continue?",
        options: ["Break exits the loop, continue skips current iteration", "Break skips iteration, continue exits loop", "Both exit loop", "Both skip iteration"],
        correctAnswer: 0,
        explanation: "`break` stops the loop completely; `continue` moves to the next iteration.",
        type: "question"
      },
      {
        question: "Can break be used in a switch statement?",
        options: ["Yes", "No", "Only in loops", "Only in functions"],
        correctAnswer: 0,
        explanation: "`break` stops execution of a case in switch statements.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-arrays",
  title: "C++ Arrays",
  description: "Store multiple values of the same type in a single variable.",
  difficulty: "Intermediate",
  baseXP: 150,
  baselineTime: 1.5,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declare and initialize an array",
        content: "Create an array of 5 integers.",
        code: "#include <iostream>\n\nint main() {\n    int numbers[5] = {1, 2, 3, 4, 5};\n    std::cout << numbers[0] << std::endl;\n    return 0;\n}",
        explanation: "Arrays store multiple elements of the same data type; indexing starts at 0.",
        type: "theory"
      },
      {
        title: "Example 2: Access array elements",
        content: "Print all elements using a for loop.",
        code: "#include <iostream>\n\nint main() {\n    int numbers[5] = {1, 2, 3, 4, 5};\n    for(int i = 0; i < 5; i++) {\n        std::cout << numbers[i] << \" \";\n    }\n    return 0;\n}",
        explanation: "Use the index to access individual elements of an array.",
        type: "theory"
      },
      {
        title: "Example 3: Modify array elements",
        content: "Change the value of an element in the array.",
        code: "#include <iostream>\n\nint main() {\n    int numbers[3] = {10, 20, 30};\n    numbers[1] = 50;\n    std::cout << numbers[1];\n    return 0;\n}",
        explanation: "Array elements can be updated using their index.",
        type: "theory"
      },
      {
        title: "Example 4: Sum of array elements",
        content: "Calculate the sum of elements in an array.",
        code: "#include <iostream>\n\nint main() {\n    int numbers[4] = {2, 4, 6, 8};\n    int sum = 0;\n    for(int i = 0; i < 4; i++) {\n        sum += numbers[i];\n    }\n    std::cout << \"Sum: \" << sum;\n    return 0;\n}",
        explanation: "Iterate over the array and accumulate values to compute sum.",
        type: "theory"
      },
      {
        question: "What is the index of the first element in a C++ array?",
        options: ["1", "0", "-1", "Depends on array size"],
        correctAnswer: 1,
        explanation: "Array indexing in C++ always starts at 0.",
        type: "question"
      },
      {
        question: "How do you access the third element of an array named numbers?",
        options: ["numbers[2]", "numbers[3]", "numbers(2)", "numbers{3}"],
        correctAnswer: 0,
        explanation: "The third element is at index 2 because indexing starts at 0.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-structures",
  title: "C++ Structures",
  description: "Group different types of variables under a single name.",
  difficulty: "Intermediate",
  baseXP: 160,
  baselineTime: 1.5,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Define a structure",
        content: "Create a structure to store a person's data.",
        code: "#include <iostream>\nstruct Person {\n    std::string name;\n    int age;\n};\n\nint main() {\n    Person p1;\n    p1.name = \"Alice\";\n    p1.age = 25;\n    std::cout << p1.name << \" is \" << p1.age << \" years old.\";\n    return 0;\n}",
        explanation: "Structures can hold multiple variables of different types together.",
        type: "theory"
      },
      {
        title: "Example 2: Initialize structure at declaration",
        content: "Assign values while declaring.",
        code: "#include <iostream>\nstruct Point {\n    int x, y;\n};\n\nint main() {\n    Point p = {10, 20};\n    std::cout << \"X: \" << p.x << \", Y: \" << p.y;\n    return 0;\n}",
        explanation: "Structures can be initialized using curly braces during declaration.",
        type: "theory"
      },
      {
        title: "Example 3: Array of structures",
        content: "Store multiple persons in an array of structures.",
        code: "#include <iostream>\nstruct Person { std::string name; int age; };\n\nint main() {\n    Person people[2] = { {\"Bob\", 30}, {\"Eve\", 28} };\n    std::cout << people[1].name << std::endl;\n    return 0;\n}",
        explanation: "Arrays of structures allow storing multiple objects of the same structure type.",
        type: "theory"
      },
      {
        title: "Example 4: Nested structures",
        content: "A structure inside another structure.",
        code: "#include <iostream>\nstruct Date {\n    int day, month, year;\n};\nstruct Event {\n    std::string name;\n    Date date;\n};\nint main() {\n    Event e = {\"Birthday\", {16, 8, 2025}};\n    std::cout << e.name << \" on \" << e.date.day << std::endl;\n    return 0;\n}",
        explanation: "Structures can contain other structures as members.",
        type: "theory"
      },
      {
        question: "Which keyword is used to define a structure?",
        options: ["class", "struct", "object", "variable"],
        correctAnswer: 1,
        explanation: "`struct` is used to define a structure in C++.",
        type: "question"
      },
      {
        question: "Can a structure contain different data types?",
        options: ["Yes", "No", "Only same type", "Only int and float"],
        correctAnswer: 0,
        explanation: "Structures can contain variables of different data types.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-enums",
  title: "C++ Enums",
  description: "Define a set of named integer constants.",
  difficulty: "Intermediate",
  baseXP: 170,
  baselineTime: 1.5,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Define a simple enum",
        content: "Create an enum for days of the week.",
        code: "#include <iostream>\nenum Day { Monday, Tuesday, Wednesday, Thursday, Friday };\nint main() {\n    Day today = Wednesday;\n    std::cout << today;\n    return 0;\n}",
        explanation: "Enums assign integer values starting from 0 by default to named constants.",
        type: "theory"
      },
      {
        title: "Example 2: Assign custom values",
        content: "Set specific values for enum members.",
        code: "#include <iostream>\nenum Color { Red = 1, Green = 5, Blue = 10 };\nint main() {\n    Color c = Green;\n    std::cout << c;\n    return 0;\n}",
        explanation: "You can assign custom integer values to enum members.",
        type: "theory"
      },
      {
        title: "Example 3: Enum and switch",
        content: "Use enum in a switch statement.",
        code: "#include <iostream>\nenum Traffic { Red, Yellow, Green };\nint main() {\n    Traffic light = Yellow;\n    switch(light) {\n        case Red: std::cout << \"Stop\"; break;\n        case Yellow: std::cout << \"Caution\"; break;\n        case Green: std::cout << \"Go\"; break;\n    }\n    return 0;\n}",
        explanation: "Enums make switch statements readable by using descriptive names.",
        type: "theory"
      },
      {
        title: "Example 4: Implicit integer values",
        content: "Print enum values to see their integer representation.",
        code: "#include <iostream>\nenum Size { Small, Medium, Large };\nint main() {\n    std::cout << Small << \", \" << Medium << \", \" << Large;\n    return 0;\n}",
        explanation: "Enum members have underlying integer values, starting from 0 unless specified.",
        type: "theory"
      },
      {
        question: "What is the default integer value of the first enum member?",
        options: ["0", "1", "Depends on compiler", "-1"],
        correctAnswer: 0,
        explanation: "By default, the first enum member has the value 0.",
        type: "question"
      },
      {
        question: "Can enums be used in switch statements for readability?",
        options: ["Yes", "No", "Only in C++11", "Only with classes"],
        correctAnswer: 0,
        explanation: "Enums are commonly used in switch statements for clarity.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-references",
  title: "C++ References",
  description: "Create an alias for a variable to manipulate it directly.",
  difficulty: "Intermediate",
  baseXP: 180,
  baselineTime: 1.5,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic reference",
        content: "Create a reference to a variable.",
        code: "#include <iostream>\nint main() {\n    int a = 10;\n    int &ref = a;\n    ref = 20;\n    std::cout << a;\n    return 0;\n}",
        explanation: "References act as aliases to the original variable; modifying them changes the original.",
        type: "theory"
      },
      {
        title: "Example 2: Reference as function parameter",
        content: "Pass variable by reference to a function.",
        code: "#include <iostream>\nvoid doubleValue(int &x) {\n    x *= 2;\n}\nint main() {\n    int num = 5;\n    doubleValue(num);\n    std::cout << num;\n    return 0;\n}",
        explanation: "Passing by reference allows functions to modify the original variable.",
        type: "theory"
      },
      {
        title: "Example 3: Reference to array element",
        content: "Use a reference to change an element in an array.",
        code: "#include <iostream>\nint main() {\n    int arr[3] = {1,2,3};\n    int &ref = arr[0];\n    ref = 10;\n    std::cout << arr[0];\n    return 0;\n}",
        explanation: "References can alias array elements for easier modification.",
        type: "theory"
      },
      {
        title: "Example 4: Multiple references not allowed",
        content: "You cannot reassign a reference to another variable.",
        code: "#include <iostream>\nint main() {\n    int a = 5, b = 10;\n    int &ref = a;\n    // ref = b; // This assigns value, not reference\n    std::cout << ref;\n    return 0;\n}",
        explanation: "A reference is bound to a variable when declared and cannot be reseated.",
        type: "theory"
      },
      {
        question: "Can you reassign a reference to another variable?",
        options: ["Yes", "No", "Sometimes", "Only with pointers"],
        correctAnswer: 1,
        explanation: "References cannot be reseated; they always refer to the variable they were initialized with.",
        type: "question"
      },
      {
        question: "Why pass a variable by reference to a function?",
        options: ["To save memory", "To modify original variable", "To avoid compilation", "To copy value"],
        correctAnswer: 1,
        explanation: "Passing by reference allows the function to modify the original variable.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-pointers",
  title: "C++ Pointers",
  description: "Store memory addresses of variables for indirect manipulation.",
  difficulty: "Intermediate",
  baseXP: 190,
  baselineTime: 1.5,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic pointer",
        content: "Store and access the address of a variable.",
        code: "#include <iostream>\nint main() {\n    int a = 5;\n    int *ptr = &a;\n    std::cout << *ptr;\n    return 0;\n}",
        explanation: "*ptr accesses the value at the memory address stored in ptr.",
        type: "theory"
      },
      {
        title: "Example 2: Modify value via pointer",
        content: "Change a variable using its pointer.",
        code: "#include <iostream>\nint main() {\n    int a = 5;\n    int *ptr = &a;\n    *ptr = 10;\n    std::cout << a;\n    return 0;\n}",
        explanation: "Pointers can modify the original variable by dereferencing.",
        type: "theory"
      },
      {
        title: "Example 3: Pointer to pointer",
        content: "Pointer that points to another pointer.",
        code: "#include <iostream>\nint main() {\n    int a = 5;\n    int *ptr = &a;\n    int **ptr2 = &ptr;\n    std::cout << **ptr2;\n    return 0;\n}",
        explanation: "Double pointers store the address of another pointer.",
        type: "theory"
      },
      {
        title: "Example 4: Pointers and arrays",
        content: "Access array elements via pointers.",
        code: "#include <iostream>\nint main() {\n    int arr[3] = {1,2,3};\n    int *ptr = arr;\n    std::cout << *(ptr+1);\n    return 0;\n}",
        explanation: "Array names are pointers; pointer arithmetic can access elements.",
        type: "theory"
      },
      {
        question: "What does *ptr do in C++?",
        options: ["Stores address", "Access value at address", "Deletes variable", "Copies pointer"],
        correctAnswer: 1,
        explanation: "*ptr dereferences the pointer to access or modify the value.",
        type: "question"
      },
      {
        question: "Can pointers modify the original variable?",
        options: ["Yes", "No", "Only arrays", "Only constants"],
        correctAnswer: 0,
        explanation: "Dereferencing a pointer allows you to modify the variable it points to.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-memory-management",
  title: "C++ Memory Management",
  description: "Allocate and deallocate memory dynamically.",
  difficulty: "Intermediate",
  baseXP: 200,
  baselineTime: 1.5,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Allocate memory using new",
        content: "Create a dynamic integer.",
        code: "#include <iostream>\nint main() {\n    int *ptr = new int;\n    *ptr = 42;\n    std::cout << *ptr;\n    delete ptr;\n    return 0;\n}",
        explanation: "Use `new` to allocate memory on the heap and `delete` to free it.",
        type: "theory"
      },
      {
        title: "Example 2: Dynamic array",
        content: "Create an array dynamically.",
        code: "#include <iostream>\nint main() {\n    int *arr = new int[5];\n    for(int i=0;i<5;i++) arr[i]=i;\n    std::cout << arr[2];\n    delete[] arr;\n    return 0;\n}",
        explanation: "Use `new[]` and `delete[]` for dynamic arrays to manage memory manually.",
        type: "theory"
      },
      {
        title: "Example 3: Avoid memory leaks",
        content: "Always delete dynamically allocated memory.",
        code: "// Example in Example 2: delete[] arr; prevents memory leak.",
        explanation: "Failing to deallocate memory causes leaks, which can crash programs.",
        type: "theory"
      },
      {
        title: "Example 4: Pointer reassignment",
        content: "Delete old memory before assigning new.",
        code: "#include <iostream>\nint main() {\n    int *ptr = new int(10);\n    delete ptr;\n    ptr = new int(20);\n    std::cout << *ptr;\n    delete ptr;\n    return 0;\n}",
        explanation: "Always free previous memory before assigning a new heap allocation to the pointer.",
        type: "theory"
      },
      {
        question: "Which keyword allocates memory dynamically in C++?",
        options: ["malloc", "new", "alloc", "create"],
        correctAnswer: 1,
        explanation: "`new` allocates memory on the heap in C++.",
        type: "question"
      },
      {
        question: "Why must you delete dynamically allocated memory?",
        options: ["To avoid memory leaks", "To initialize variables", "To speed up code", "It is optional"],
        correctAnswer: 0,
        explanation: "Deleting memory prevents memory leaks and frees system resources.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-functions",
  title: "C++ Functions",
  description: "Create reusable blocks of code to perform tasks.",
  difficulty: "Intermediate",
  baseXP: 210,
  baselineTime: 1.5,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic function",
        content: "Define and call a simple function.",
        code: "#include <iostream>\nvoid greet() {\n    std::cout << \"Hello!\";\n}\nint main() {\n    greet();\n    return 0;\n}",
        explanation: "Functions group code for reusability; `void` means no return value.",
        type: "theory"
      },
      {
        title: "Example 2: Function returning value",
        content: "Return a value from a function.",
        code: "#include <iostream>\nint add() {\n    return 5 + 3;\n}\nint main() {\n    std::cout << add();\n    return 0;\n}",
        explanation: "Functions can return values that can be used in expressions or output.",
        type: "theory"
      },
      {
        title: "Example 3: Function with local variable",
        content: "Variables inside a function are local.",
        code: "#include <iostream>\nvoid show() {\n    int x = 10;\n    std::cout << x;\n}\nint main() {\n    show();\n    // std::cout << x; // Error: x not visible here\n    return 0;\n}",
        explanation: "Variables inside functions exist only within the function scope.",
        type: "theory"
      },
      {
        title: "Example 4: Calling multiple times",
        content: "Use the same function multiple times.",
        code: "#include <iostream>\nvoid greet() { std::cout << \"Hi\\n\"; }\nint main() {\n    greet();\n    greet();\n    return 0;\n}",
        explanation: "Functions avoid repeating code by calling the same logic multiple times.",
        type: "theory"
      },
      {
        question: "What does a void function return?",
        options: ["A number", "Nothing", "A string", "An array"],
        correctAnswer: 1,
        explanation: "Void functions do not return any value.",
        type: "question"
      },
      {
        question: "Why use functions?",
        options: ["To repeat code easily", "To declare variables", "To make comments", "To run faster"],
        correctAnswer: 0,
        explanation: "Functions help reuse code without rewriting it.",
        type: "question"
      }
    ]
  }
},

{
  id: "cpp-function-parameters",
  title: "C++ Function Parameters",
  description: "Pass data into functions to make them more flexible.",
  difficulty: "Intermediate",
  baseXP: 220,
  baselineTime: 1.5,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Function with parameters",
        content: "Pass values to a function.",
        code: "#include <iostream>\nvoid greet(std::string name) {\n    std::cout << \"Hello, \" << name;\n}\nint main() {\n    greet(\"Alice\");\n    return 0;\n}",
        explanation: "Parameters allow functions to receive data from the caller.",
        type: "theory"
      },
      {
        title: "Example 2: Multiple parameters",
        content: "Pass more than one value.",
        code: "#include <iostream>\nint add(int a, int b) {\n    return a + b;\n}\nint main() {\n    std::cout << add(5,3);\n    return 0;\n}",
        explanation: "Functions can accept multiple parameters separated by commas.",
        type: "theory"
      },
      {
        title: "Example 3: Pass by reference",
        content: "Modify a variable using a reference parameter.",
        code: "#include <iostream>\nvoid doubleValue(int &x) { x *= 2; }\nint main() {\n    int num = 5;\n    doubleValue(num);\n    std::cout << num;\n    return 0;\n}",
        explanation: "Reference parameters allow functions to change the original variable.",
        type: "theory"
      },
      {
        title: "Example 4: Default parameters",
        content: "Provide default values for parameters.",
        code: "#include <iostream>\nvoid greet(std::string name=\"Guest\") {\n    std::cout << \"Hello, \" << name;\n}\nint main() {\n    greet();\n    return 0;\n}",
        explanation: "Default parameters are used when no argument is provided.",
        type: "theory"
      },
      {
        question: "What happens when you pass a variable by reference?",
        options: ["It copies the value", "It modifies the original variable", "It prints the value", "It creates a pointer"],
        correctAnswer: 1,
        explanation: "Passing by reference allows the function to modify the original variable.",
        type: "question"
      },
      {
        question: "Can a function have more than one parameter?",
        options: ["Yes", "No", "Only in C++11", "Only with void functions"],
        correctAnswer: 0,
        explanation: "Functions can have multiple parameters separated by commas.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-function-overloading",
  title: "C++ Function Overloading",
  description: "Define multiple functions with the same name but different parameters.",
  difficulty: "Intermediate",
  baseXP: 230,
  baselineTime: 1.5,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Overload by parameter type",
        content: "Same function name with different types.",
        code: "#include <iostream>\nvoid print(int x) { std::cout << x; }\nvoid print(std::string s) { std::cout << s; }\nint main() {\n    print(5);\n    print(\"Hi\");\n    return 0;\n}",
        explanation: "Function overloading allows the same name for different parameter types.",
        type: "theory"
      },
      {
        title: "Example 2: Overload by number of parameters",
        content: "Different number of arguments.",
        code: "#include <iostream>\nint add(int a, int b) { return a+b; }\nint add(int a, int b, int c) { return a+b+c; }\nint main() {\n    std::cout << add(1,2) << \",\" << add(1,2,3);\n    return 0;\n}",
        explanation: "Functions can differ by number of parameters for overloading.",
        type: "theory"
      },
      {
        title: "Example 3: Cannot overload by return type",
        content: "Return type alone is not enough to overload.",
        code: "// int func() {}\n// double func() {} // Error: overloading needs different params",
        explanation: "Return type cannot distinguish overloaded functions.",
        type: "theory"
      },
      {
        title: "Example 4: Using overloads",
        content: "Call overloaded functions appropriately.",
        code: "#include <iostream>\nvoid show(int a) { std::cout << a; }\nvoid show(std::string s) { std::cout << s; }\nint main() {\n    show(10);\n    show(\"Hello\");\n    return 0;\n}",
        explanation: "Compiler chooses the correct function based on arguments.",
        type: "theory"
      },
      {
        question: "Can functions be overloaded only by return type?",
        options: ["Yes", "No", "Sometimes", "Only with void"],
        correctAnswer: 1,
        explanation: "Overloading requires a difference in parameters, not return type.",
        type: "question"
      },
      {
        question: "How does the compiler select an overloaded function?",
        options: ["Based on function name only", "Based on argument types and number", "Based on return type", "Randomly"],
        correctAnswer: 1,
        explanation: "The compiler matches the function call with parameters to pick the correct overload.",
        type: "question"
      }
    ]
  }
},
  {
  id: "cpp-scope",
  title: "C++ Scope",
  description: "Understand where variables are accessible in your code.",
  difficulty: "Intermediate",
  baseXP: 240,
  baselineTime: 1.5,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Local scope",
        content: "Variables inside a function are local to it.",
        code: "#include <iostream>\nint main() {\n    int x = 10;\n    std::cout << x;\n    return 0;\n}",
        explanation: "x exists only inside main; it cannot be used elsewhere.",
        type: "theory"
      },
      {
        title: "Example 2: Block scope",
        content: "Variables inside a block are limited to that block.",
        code: "#include <iostream>\nint main() {\n    if(true) {\n        int y = 5;\n        std::cout << y;\n    }\n    // std::cout << y; // Error\n    return 0;\n}",
        explanation: "y only exists inside the if block; outside it, it’s undefined.",
        type: "theory"
      },
      {
        title: "Example 3: Global scope",
        content: "Variables declared outside functions are global.",
        code: "#include <iostream>\nint x = 100;\nint main() {\n    std::cout << x;\n    return 0;\n}",
        explanation: "Global variables can be accessed from any function in the file.",
        type: "theory"
      },
      {
        title: "Example 4: Shadowing",
        content: "Local variables can shadow global ones.",
        code: "#include <iostream>\nint x = 10;\nint main() {\n    int x = 5;\n    std::cout << x; // prints 5, not 10\n    return 0;\n}",
        explanation: "Local variable hides the global variable with the same name.",
        type: "theory"
      },
      {
        question: "Where is a local variable accessible?",
        options: ["Anywhere in the file", "Inside its function/block", "Only in main", "Outside main"],
        correctAnswer: 1,
        explanation: "Local variables exist only within the function or block they are defined in.",
        type: "question"
      },
      {
        question: "What happens if a local variable has the same name as a global variable?",
        options: ["Error", "Local variable shadows global variable", "Global variable overrides local", "Both are combined"],
        correctAnswer: 1,
        explanation: "The local variable takes precedence inside its scope.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-recursion",
  title: "C++ Recursion",
  description: "A function calling itself to solve smaller sub-problems.",
  difficulty: "Intermediate",
  baseXP: 250,
  baselineTime: 1.5,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Simple recursion",
        content: "A function calling itself once.",
        code: "#include <iostream>\nvoid sayHi(int n) {\n    if(n>0) {\n        std::cout << \"Hi\\n\";\n        sayHi(n-1);\n    }\n}\nint main() {\n    sayHi(3);\n    return 0;\n}",
        explanation: "The function calls itself until the base condition is met.",
        type: "theory"
      },
      {
        title: "Example 2: Factorial using recursion",
        content: "Calculate factorial of a number.",
        code: "#include <iostream>\nint factorial(int n) {\n    if(n==0) return 1;\n    return n * factorial(n-1);\n}\nint main() {\n    std::cout << factorial(5);\n    return 0;\n}",
        explanation: "Recursion breaks a problem into smaller identical problems.",
        type: "theory"
      },
      {
        title: "Example 3: Base case importance",
        content: "Stop recursion to avoid infinite calls.",
        code: "#include <iostream>\nvoid countDown(int n) {\n    if(n <= 0) return;\n    std::cout << n << \" \";\n    countDown(n-1);\n}\nint main() {\n    countDown(5);\n    return 0;\n}",
        explanation: "Without a base case, recursion leads to a stack overflow error.",
        type: "theory"
      },
      {
        title: "Example 4: Recursive sum",
        content: "Sum numbers from 1 to n recursively.",
        code: "#include <iostream>\nint sum(int n) {\n    if(n==0) return 0;\n    return n + sum(n-1);\n}\nint main() {\n    std::cout << sum(5);\n    return 0;\n}",
        explanation: "Each recursive call simplifies the problem until reaching the base case.",
        type: "theory"
      },
      {
        question: "Why is a base case necessary in recursion?",
        options: ["To make function faster", "To prevent infinite calls", "To return void", "To create variables"],
        correctAnswer: 1,
        explanation: "Base cases stop recursion from running indefinitely and causing a crash.",
        type: "question"
      },
      {
        question: "What is recursion primarily used for?",
        options: ["Loops", "Breaking problem into smaller identical problems", "Printing text", "Memory management"],
        correctAnswer: 1,
        explanation: "Recursion divides problems into smaller, similar sub-problems to solve them.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-lambda",
  title: "C++ Lambda",
  description: "Anonymous functions defined inline for short tasks.",
  difficulty: "Intermediate",
  baseXP: 260,
  baselineTime: 1.5,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic lambda",
        content: "Define and call a lambda function.",
        code: "#include <iostream>\nint main() {\n    auto greet = [](){ std::cout << \"Hello Lambda!\"; };\n    greet();\n    return 0;\n}",
        explanation: "Lambda functions are anonymous functions stored in variables.",
        type: "theory"
      },
      {
        title: "Example 2: Lambda with parameters",
        content: "Pass values into lambda.",
        code: "#include <iostream>\nint main() {\n    auto add = [](int a, int b){ return a + b; };\n    std::cout << add(5,3);\n    return 0;\n}",
        explanation: "Lambdas can accept parameters just like normal functions.",
        type: "theory"
      },
      {
        title: "Example 3: Lambda capturing variables",
        content: "Use external variable inside lambda.",
        code: "#include <iostream>\nint main() {\n    int x = 10;\n    auto printX = [x](){ std::cout << x; };\n    printX();\n    return 0;\n}",
        explanation: "Capture lists allow lambdas to access variables from the surrounding scope.",
        type: "theory"
      },
      {
        title: "Example 4: Immediate invocation",
        content: "Call lambda immediately without storing it.",
        code: "#include <iostream>\nint main() {\n    [](){ std::cout << \"Called immediately!\"; }();\n    return 0;\n}",
        explanation: "Lambdas can be defined and executed in a single line.",
        type: "theory"
      },
      {
        question: "What is a lambda function?",
        options: ["A named function", "An anonymous function", "A global variable", "A type of pointer"],
        correctAnswer: 1,
        explanation: "Lambda functions are anonymous functions often used for short tasks.",
        type: "question"
      },
      {
        question: "How do you pass arguments to a lambda?",
        options: ["Using parentheses like normal functions", "Using brackets", "Using curly braces", "Cannot pass arguments"],
        correctAnswer: 0,
        explanation: "Lambdas accept parameters in parentheses, similar to normal functions.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-classes-objects",
  title: "C++ Classes & Objects",
  description: "Learn how to create classes and objects in C++.",
  difficulty: "Intermediate",
  baseXP: 270,
  baselineTime: 1.5,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Define a simple class",
        content: "Create a class with a member variable.",
        code: "#include <iostream>\nclass Car {\npublic:\n    std::string brand;\n};\nint main() {\n    Car myCar;\n    myCar.brand = \"Toyota\";\n    std::cout << myCar.brand;\n    return 0;\n}",
        explanation: "Classes are blueprints; objects are instances of classes.",
        type: "theory"
      },
      {
        title: "Example 2: Multiple objects",
        content: "Create several objects from the same class.",
        code: "#include <iostream>\nclass Car {\npublic:\n    std::string brand;\n};\nint main() {\n    Car car1, car2;\n    car1.brand = \"Honda\";\n    car2.brand = \"Ford\";\n    std::cout << car1.brand << \", \" << car2.brand;\n    return 0;\n}",
        explanation: "Each object has its own copy of the class members.",
        type: "theory"
      },
      {
        title: "Example 3: Member initialization",
        content: "Assign values to members when creating an object.",
        code: "#include <iostream>\nclass Car {\npublic:\n    std::string brand;\n};\nint main() {\n    Car myCar;\n    myCar.brand = \"BMW\";\n    std::cout << myCar.brand;\n    return 0;\n}",
        explanation: "You can set class member values after creating the object.",
        type: "theory"
      },
      {
        title: "Example 4: Object interaction",
        content: "Objects can be used to represent real-world entities.",
        code: "#include <iostream>\nclass Student {\npublic:\n    std::string name;\n    int age;\n};\nint main() {\n    Student s1;\n    s1.name = \"Alice\";\n    s1.age = 20;\n    std::cout << s1.name << \" is \" << s1.age << \" years old.\";\n    return 0;\n}",
        explanation: "Objects store and manipulate data for specific entities.",
        type: "theory"
      },
      {
        question: "What is an object in C++?",
        options: ["A blueprint", "A function", "An instance of a class", "A pointer"],
        correctAnswer: 2,
        explanation: "Objects are specific instances created from a class blueprint.",
        type: "question"
      },
      {
        question: "Can multiple objects be created from the same class?",
        options: ["Yes", "No", "Only one", "Only pointers"],
        correctAnswer: 0,
        explanation: "You can create as many objects as needed from a class.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-class-methods",
  title: "C++ Class Methods",
  description: "Learn to define and call functions inside classes.",
  difficulty: "Intermediate",
  baseXP: 280,
  baselineTime: 1.5,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Simple method",
        content: "Define a method inside a class.",
        code: "#include <iostream>\nclass Car {\npublic:\n    void honk() {\n        std::cout << \"Beep!\";\n    }\n};\nint main() {\n    Car myCar;\n    myCar.honk();\n    return 0;\n}",
        explanation: "Methods are functions defined inside a class that operate on objects.",
        type: "theory"
      },
      {
        title: "Example 2: Method with parameters",
        content: "Methods can accept parameters.",
        code: "#include <iostream>\nclass Car {\npublic:\n    void setBrand(std::string b) {\n        brand = b;\n    }\n    std::string brand;\n};\nint main() {\n    Car myCar;\n    myCar.setBrand(\"Audi\");\n    std::cout << myCar.brand;\n    return 0;\n}",
        explanation: "Methods can modify object data using parameters.",
        type: "theory"
      },
      {
        title: "Example 3: Method returning value",
        content: "Methods can return values.",
        code: "#include <iostream>\nclass Car {\npublic:\n    std::string brand;\n    std::string getBrand() {\n        return brand;\n    }\n};\nint main() {\n    Car myCar;\n    myCar.brand = \"Tesla\";\n    std::cout << myCar.getBrand();\n    return 0;\n}",
        explanation: "Methods can return values just like regular functions.",
        type: "theory"
      },
      {
        title: "Example 4: Calling multiple methods",
        content: "Call several methods from an object.",
        code: "#include <iostream>\nclass Car {\npublic:\n    void setBrand(std::string b) { brand = b; }\n    void showBrand() { std::cout << brand; }\nprivate:\n    std::string brand;\n};\nint main() {\n    Car myCar;\n    myCar.setBrand(\"Mazda\");\n    myCar.showBrand();\n    return 0;\n}",
        explanation: "Methods allow interacting with private members safely.",
        type: "theory"
      },
      {
        question: "What is a method in C++?",
        options: ["A function outside a class", "A function inside a class", "A variable", "A pointer"],
        correctAnswer: 1,
        explanation: "Methods are functions defined inside a class to manipulate its objects.",
        type: "question"
      },
      {
        question: "Can a method return a value?",
        options: ["Yes", "No", "Only void", "Only integers"],
        correctAnswer: 0,
        explanation: "Methods can return any type of value like regular functions.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-constructors",
  title: "C++ Constructors",
  description: "Learn how constructors initialize objects when created.",
  difficulty: "Intermediate",
  baseXP: 290,
  baselineTime: 1.5,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Simple constructor",
        content: "Define a constructor that sets a member variable.",
        code: "#include <iostream>\nclass Car {\npublic:\n    std::string brand;\n    Car() { brand = \"Default\"; }\n};\nint main() {\n    Car myCar;\n    std::cout << myCar.brand;\n    return 0;\n}",
        explanation: "A constructor is called automatically when an object is created.",
        type: "theory"
      },
      {
        title: "Example 2: Constructor with parameters",
        content: "Set member variables using constructor parameters.",
        code: "#include <iostream>\nclass Car {\npublic:\n    std::string brand;\n    Car(std::string b) { brand = b; }\n};\nint main() {\n    Car myCar(\"BMW\");\n    std::cout << myCar.brand;\n    return 0;\n}",
        explanation: "Parameterized constructors allow flexible initialization.",
        type: "theory"
      },
      {
        title: "Example 3: Multiple objects with different constructors",
        content: "Each object can have its own initial values.",
        code: "#include <iostream>\nclass Car {\npublic:\n    std::string brand;\n    Car(std::string b) { brand = b; }\n};\nint main() {\n    Car car1(\"Audi\"), car2(\"Tesla\");\n    std::cout << car1.brand << \", \" << car2.brand;\n    return 0;\n}",
        explanation: "Constructors ensure each object starts with correct data.",
        type: "theory"
      },
      {
        title: "Example 4: Default and parameterized constructor",
        content: "A class can have both default and parameterized constructors.",
        code: "#include <iostream>\nclass Car {\npublic:\n    std::string brand;\n    Car() { brand = \"Unknown\"; }\n    Car(std::string b) { brand = b; }\n};\nint main() {\n    Car c1, c2(\"Ford\");\n    std::cout << c1.brand << \", \" << c2.brand;\n    return 0;\n}",
        explanation: "Overloading constructors allows multiple ways to create objects.",
        type: "theory"
      },
      {
        question: "When is a constructor called?",
        options: ["Manually by calling it", "Automatically when an object is created", "Only in main()", "When printing values"],
        correctAnswer: 1,
        explanation: "Constructors are automatically invoked during object creation.",
        type: "question"
      },
      {
        question: "Can a class have multiple constructors?",
        options: ["Yes", "No", "Only one", "Depends on the compiler"],
        correctAnswer: 0,
        explanation: "C++ allows multiple constructors with different parameters (constructor overloading).",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-access-specifiers",
  title: "C++ Access Specifiers",
  description: "Learn about public, private, and protected members in classes.",
  difficulty: "Intermediate",
  baseXP: 300,
  baselineTime: 1.5,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Public member",
        content: "Public members can be accessed outside the class.",
        code: "#include <iostream>\nclass Car {\npublic:\n    std::string brand;\n};\nint main() {\n    Car myCar;\n    myCar.brand = \"Toyota\";\n    std::cout << myCar.brand;\n    return 0;\n}",
        explanation: "Public members are accessible from anywhere the object is visible.",
        type: "theory"
      },
      {
        title: "Example 2: Private member",
        content: "Private members cannot be accessed outside the class.",
        code: "#include <iostream>\nclass Car {\nprivate:\n    std::string brand;\npublic:\n    void setBrand(std::string b) { brand = b; }\n    std::string getBrand() { return brand; }\n};\nint main() {\n    Car myCar;\n    myCar.setBrand(\"Honda\");\n    std::cout << myCar.getBrand();\n    return 0;\n}",
        explanation: "Private members protect data from direct access.",
        type: "theory"
      },
      {
        title: "Example 3: Protected member (concept)",
        content: "Protected members are accessible in derived classes.",
        code: "#include <iostream>\nclass Vehicle {\nprotected:\n    int wheels;\n};\nclass Car : public Vehicle {\npublic:\n    void setWheels(int w) { wheels = w; }\n    int getWheels() { return wheels; }\n};\nint main() {\n    Car myCar;\n    myCar.setWheels(4);\n    std::cout << myCar.getWheels();\n    return 0;\n}",
        explanation: "Protected members allow inheritance access but hide from outside.",
        type: "theory"
      },
      {
        title: "Example 4: Access specifier summary",
        content: "Use public, private, protected to control access.",
        code: "// Conceptual example, no executable code\n// Public: accessible anywhere\n// Private: only inside class\n// Protected: inside class and derived classes",
        explanation: "Access specifiers manage visibility and security of data members.",
        type: "theory"
      },
      {
        question: "Which access specifier allows access outside the class?",
        options: ["Private", "Protected", "Public", "None"],
        correctAnswer: 2,
        explanation: "Public members can be accessed from anywhere.",
        type: "question"
      },
      {
        question: "Which access specifier can derived classes access?",
        options: ["Private", "Protected", "Public", "Both Protected and Public"],
        correctAnswer: 3,
        explanation: "Derived classes can access protected and public members.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-encapsulation",
  title: "C++ Encapsulation",
  description: "Learn how encapsulation hides class data and exposes methods.",
  difficulty: "Intermediate",
  baseXP: 310,
  baselineTime: 1.5,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Encapsulate a class",
        content: "Keep data private and provide public getter/setter methods.",
        code: "#include <iostream>\nclass BankAccount {\nprivate:\n    double balance;\npublic:\n    void setBalance(double b) { balance = b; }\n    double getBalance() { return balance; }\n};\nint main() {\n    BankAccount acc;\n    acc.setBalance(1000);\n    std::cout << acc.getBalance();\n    return 0;\n}",
        explanation: "Encapsulation protects class data by controlling access.",
        type: "theory"
      },
      {
        title: "Example 2: Restrict invalid values",
        content: "Encapsulation allows validation inside setters.",
        code: "#include <iostream>\nclass BankAccount {\nprivate:\n    double balance;\npublic:\n    void setBalance(double b) { if(b>=0) balance = b; }\n    double getBalance() { return balance; }\n};\nint main() {\n    BankAccount acc;\n    acc.setBalance(-500); // ignored\n    std::cout << acc.getBalance();\n    return 0;\n}",
        explanation: "Setters can enforce rules and prevent invalid data.",
        type: "theory"
      },
      {
        title: "Example 3: Private and public separation",
        content: "Private members store data; public methods interact with it.",
        code: "// Conceptual example\n// private: balance\n// public: getBalance(), setBalance()",
        explanation: "Encapsulation separates implementation from interface.",
        type: "theory"
      },
      {
        title: "Example 4: Real-life analogy",
        content: "Like an ATM: you cannot access internal cash directly; only via functions.",
        code: "// No code, conceptual explanation",
        explanation: "Encapsulation hides complexity and prevents misuse.",
        type: "theory"
      },
      {
        question: "What is the main purpose of encapsulation?",
        options: ["Increase speed", "Hide data and control access", "Allow global variables", "Simplify syntax"],
        correctAnswer: 1,
        explanation: "Encapsulation hides class data and allows controlled access via methods.",
        type: "question"
      },
      {
        question: "Where should class data ideally be declared?",
        options: ["Public", "Private", "Global", "Static"],
        correctAnswer: 1,
        explanation: "Class data should be private to implement encapsulation.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-friend-functions",
  title: "C++ Friend Functions",
  description: "Learn how friend functions access private data of a class.",
  difficulty: "Advanced",
  baseXP: 330,
  baselineTime: 2,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Simple friend function",
        content: "A function declared as friend can access private members.",
        code: "#include <iostream>\nclass Box {\nprivate:\n    int width;\npublic:\n    Box(int w) { width = w; }\n    friend void printWidth(Box b);\n};\nvoid printWidth(Box b) { std::cout << b.width; }\nint main() {\n    Box b(10);\n    printWidth(b);\n    return 0;\n}",
        explanation: "Friend functions bypass access restrictions.",
        type: "theory"
      },
      {
        title: "Example 2: Multiple friend functions",
        content: "A class can have more than one friend function.",
        code: "// Conceptual: friend void f1(Box), friend void f2(Box)",
        explanation: "Friend functions allow selective access to private data.",
        type: "theory"
      },
      {
        title: "Example 3: Not a member",
        content: "Friend functions are not members but can access private data.",
        code: "// Conceptual explanation",
        explanation: "Friend functions do not belong to the class, but they can see private members.",
        type: "theory"
      },
      {
        title: "Example 4: Friend function with multiple objects",
        content: "It can access private data of multiple objects if passed.",
        code: "#include <iostream>\nclass Box {\nprivate:\n    int width;\npublic:\n    Box(int w) { width = w; }\n    friend void compareWidth(Box b1, Box b2);\n};\nvoid compareWidth(Box b1, Box b2) {\n    std::cout << (b1.width > b2.width ? \"b1\" : \"b2\");\n}\nint main() {\n    Box a(5), b(10);\n    compareWidth(a,b);\n    return 0;\n}",
        explanation: "Friend functions can access private members of multiple objects.",
        type: "theory"
      },
      {
        question: "Can friend functions access private members?",
        options: ["Yes", "No", "Only public members", "Only protected members"],
        correctAnswer: 0,
        explanation: "Friend functions can access private members of a class.",
        type: "question"
      },
      {
        question: "Are friend functions members of the class?",
        options: ["Yes", "No", "Sometimes", "Only static members"],
        correctAnswer: 1,
        explanation: "Friend functions are not class members but can access private data.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-inheritance",
  title: "C++ Inheritance",
  description: "Learn how classes can inherit properties and methods from other classes.",
  difficulty: "Advanced",
  baseXP: 350,
  baselineTime: 2,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic inheritance",
        content: "Child class inherits public members of parent class.",
        code: "#include <iostream>\nclass Animal {\npublic:\n    void eat() { std::cout << \"Eating\"; }\n};\nclass Dog : public Animal {};\nint main() {\n    Dog d;\n    d.eat();\n    return 0;\n}",
        explanation: "Dog inherits eat() from Animal using public inheritance.",
        type: "theory"
      },
      {
        title: "Example 2: Adding child-specific methods",
        content: "Child class can have its own methods.",
        code: "#include <iostream>\nclass Animal {\npublic:\n    void eat() { std::cout << \"Eating\"; }\n};\nclass Dog : public Animal {\npublic:\n    void bark() { std::cout << \"Barking\"; }\n};\nint main() {\n    Dog d;\n    d.eat();\n    d.bark();\n    return 0;\n}",
        explanation: "Inheritance allows combining parent methods with child-specific methods.",
        type: "theory"
      },
      {
        title: "Example 3: Protected members",
        content: "Protected members are accessible by child classes but not outside.",
        code: "#include <iostream>\nclass Animal {\nprotected:\n    int age;\npublic:\n    void setAge(int a) { age=a; }\n};\nclass Dog : public Animal {\npublic:\n    void showAge() { std::cout << age; }\n};\nint main() {\n    Dog d;\n    d.setAge(3);\n    d.showAge();\n    return 0;\n}",
        explanation: "Protected members give controlled access to derived classes.",
        type: "theory"
      },
      {
        title: "Example 4: Multi-level inheritance",
        content: "Inheritance can chain across multiple classes.",
        code: "#include <iostream>\nclass Animal { public: void eat() { std::cout << \"Eating\"; } };\nclass Mammal : public Animal {};\nclass Dog : public Mammal {};\nint main() { Dog d; d.eat(); return 0; }",
        explanation: "Dog inherits from Mammal which inherits from Animal.",
        type: "theory"
      },
      {
        question: "What does inheritance allow in C++?",
        options: ["Hide data", "Reuse code from other classes", "Create global variables", "Override operators only"],
        correctAnswer: 1,
        explanation: "Inheritance allows classes to reuse code from other classes.",
        type: "question"
      },
      {
        question: "Which access modifier allows child classes to access members?",
        options: ["Private", "Protected", "Public", "Static"],
        correctAnswer: 1,
        explanation: "Protected members are accessible by derived classes.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-polymorphism",
  title: "C++ Polymorphism",
  description: "Learn how C++ supports function and operator polymorphism.",
  difficulty: "Advanced",
  baseXP: 370,
  baselineTime: 2,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Function overloading",
        content: "Multiple functions with the same name but different parameters.",
        code: "#include <iostream>\nvoid print(int i) { std::cout << i; }\nvoid print(double d) { std::cout << d; }\nint main() { print(5); print(3.14); return 0; }",
        explanation: "Polymorphism allows the same function name to behave differently based on parameters.",
        type: "theory"
      },
      {
        title: "Example 2: Virtual functions",
        content: "Derived class can override parent methods at runtime.",
        code: "#include <iostream>\nclass Animal {\npublic:\n    virtual void sound() { std::cout << \"Some sound\"; }\n};\nclass Dog : public Animal {\npublic:\n    void sound() override { std::cout << \"Bark\"; }\n};\nint main() { Animal* a = new Dog(); a->sound(); return 0; }",
        explanation: "Virtual functions enable runtime polymorphism.",
        type: "theory"
      },
      {
        title: "Example 3: Compile-time vs runtime",
        content: "Overloading is compile-time, virtual functions are runtime.",
        code: "// Example explanation",
        explanation: "C++ supports both types of polymorphism: compile-time and runtime.",
        type: "theory"
      },
      {
        title: "Example 4: Operator overloading",
        content: "Operators like + or == can be redefined for user-defined types.",
        code: "#include <iostream>\nclass Point {\npublic:\n    int x,y;\n    Point(int a,int b){x=a;y=b;}\n    Point operator+(Point p) { return Point(x+p.x,y+p.y); }\n};\nint main(){ Point p1(1,2), p2(3,4); Point p3 = p1+p2; std::cout<<p3.x<<\",\"<<p3.y; return 0; }",
        explanation: "Operator overloading lets objects interact like built-in types.",
        type: "theory"
      },
      {
        question: "Which C++ feature allows the same function name to behave differently?",
        options: ["Inheritance", "Polymorphism", "Encapsulation", "Friend functions"],
        correctAnswer: 1,
        explanation: "Polymorphism allows functions or operators to behave differently based on context.",
        type: "question"
      },
      {
        question: "What type of polymorphism is function overloading?",
        options: ["Runtime", "Compile-time", "Virtual", "Operator"],
        correctAnswer: 1,
        explanation: "Function overloading is resolved at compile-time, making it compile-time polymorphism.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-templates",
  title: "C++ Templates",
  description: "Learn how to create generic functions and classes with templates.",
  difficulty: "Advanced",
  baseXP: 390,
  baselineTime: 2,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Function template",
        content: "A generic function works with multiple data types.",
        code: "#include <iostream>\ntemplate <typename T>\nT add(T a, T b) { return a+b; }\nint main() { std::cout << add(5,10); std::cout << add(2.5,3.5); return 0; }",
        explanation: "Templates allow writing one function for different data types.",
        type: "theory"
      },
      {
        title: "Example 2: Class template",
        content: "Generic classes can work with any type.",
        code: "#include <iostream>\ntemplate <typename T>\nclass Box {\n    T value;\npublic:\n    Box(T v) : value(v) {}\n    T get() { return value; }\n};\nint main() { Box<int> b1(5); Box<double> b2(3.5); std::cout << b1.get() << \" \" << b2.get(); return 0; }",
        explanation: "Templates allow creating reusable classes for multiple types.",
        type: "theory"
      },
      {
        title: "Example 3: Template with multiple types",
        content: "Functions can accept multiple template types.",
        code: "#include <iostream>\ntemplate <typename T, typename U>\nvoid display(T a, U b) { std::cout << a << \" \" << b; }\nint main() { display(5, 3.5); return 0; }",
        explanation: "Multiple template parameters allow mixing types in functions.",
        type: "theory"
      },
      {
        title: "Example 4: Template with default type",
        content: "Provide a default type if none specified.",
        code: "#include <iostream>\ntemplate <typename T=int>\nT square(T x) { return x*x; }\nint main() { std::cout << square(5); std::cout << square(3.5); return 0; }",
        explanation: "Default template parameters make templates more flexible.",
        type: "theory"
      },
      {
        question: "What is the purpose of templates in C++?",
        options: ["Run code faster", "Write generic functions/classes", "Hide data", "Handle exceptions"],
        correctAnswer: 1,
        explanation: "Templates let you write functions and classes that work with any type.",
        type: "question"
      },
      {
        question: "Which of these can templates be used for?",
        options: ["Functions only", "Classes only", "Both functions and classes", "Variables only"],
        correctAnswer: 2,
        explanation: "Templates can be applied to both functions and classes.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-files",
  title: "C++ Files",
  description: "Learn how to read from and write to files in C++.",
  difficulty: "Advanced",
  baseXP: 410,
  baselineTime: 2,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Writing to a file",
        content: "Create and write text to a file.",
        code: "#include <iostream>\n#include <fstream>\nint main() {\n    std::ofstream outFile(\"example.txt\");\n    outFile << \"Hello, C++!\";\n    outFile.close();\n    return 0;\n}",
        explanation: "ofstream is used to write data to a file.",
        type: "theory"
      },
      {
        title: "Example 2: Reading from a file",
        content: "Read text from a file.",
        code: "#include <iostream>\n#include <fstream>\n#include <string>\nint main() {\n    std::ifstream inFile(\"example.txt\");\n    std::string line;\n    while(std::getline(inFile, line)) {\n        std::cout << line;\n    }\n    inFile.close();\n    return 0;\n}",
        explanation: "ifstream reads content from a file line by line.",
        type: "theory"
      },
      {
        title: "Example 3: Checking file open status",
        content: "Always check if the file opened successfully.",
        code: "#include <iostream>\n#include <fstream>\nint main() {\n    std::ifstream inFile(\"missing.txt\");\n    if(!inFile) std::cout << \"File not found!\";\n    return 0;\n}",
        explanation: "Always validate file operations to avoid errors.",
        type: "theory"
      },
      {
        title: "Example 4: Appending to a file",
        content: "Add data to an existing file without overwriting.",
        code: "#include <iostream>\n#include <fstream>\nint main() {\n    std::ofstream outFile(\"example.txt\", std::ios::app);\n    outFile << \" More text.\";\n    outFile.close();\n    return 0;\n}",
        explanation: "Use std::ios::app to append data to a file.",
        type: "theory"
      },
      {
        question: "Which class is used to read files in C++?",
        options: ["ofstream", "ifstream", "fstream", "iostream"],
        correctAnswer: 1,
        explanation: "ifstream is used for reading files in C++.",
        type: "question"
      },
      {
        question: "How can you append text to an existing file?",
        options: ["Use ios::app", "Use ios::in", "Use ios::out", "Use ios::trunc"],
        correctAnswer: 0,
        explanation: "ios::app ensures new data is added at the end of the file.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-date",
  title: "C++ Date",
  description: "Learn how to work with date and time in C++ using <ctime>.",
  difficulty: "Advanced",
  baseXP: 430,
  baselineTime: 2,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Current time",
        content: "Get and display the current system time.",
        code: "#include <iostream>\n#include <ctime>\nint main() {\n    std::time_t now = std::time(0);\n    std::cout << \"Current time: \" << std::ctime(&now);\n    return 0;\n}",
        explanation: "ctime converts the time value to a readable string.",
        type: "theory"
      },
      {
        title: "Example 2: Extracting date components",
        content: "Get year, month, day separately.",
        code: "#include <iostream>\n#include <ctime>\nint main() {\n    std::time_t t = std::time(0);\n    std::tm* now = std::localtime(&t);\n    std::cout << (now->tm_year + 1900) << \"-\" << (now->tm_mon + 1) << \"-\" << now->tm_mday;\n    return 0;\n}",
        explanation: "tm struct holds time components like year, month, day, etc.",
        type: "theory"
      },
      {
        title: "Example 3: Measuring execution time",
        content: "Use clock() to measure program runtime.",
        code: "#include <iostream>\n#include <ctime>\nint main() {\n    std::clock_t start = std::clock();\n    for(int i=0;i<1000000;i++);\n    std::clock_t end = std::clock();\n    std::cout << \"Time: \" << (double)(end-start)/CLOCKS_PER_SEC << \" seconds\";\n    return 0;\n}",
        explanation: "clock() returns processor time used by the program.",
        type: "theory"
      },
      {
        title: "Example 4: Delay using sleep",
        content: "Pause program execution for few seconds.",
        code: "#include <iostream>\n#include <thread>\n#include <chrono>\nint main() {\n    std::cout << \"Wait 3 seconds...\";\n    std::this_thread::sleep_for(std::chrono::seconds(3));\n    std::cout << \"Done\";\n    return 0;\n}",
        explanation: "Use sleep_for with chrono to pause execution.",
        type: "theory"
      },
      {
        question: "Which header is required for time functions in C++?",
        options: ["<ctime>", "<chrono>", "<time.h>", "<iostream>"],
        correctAnswer: 0,
        explanation: "The <ctime> header provides standard C time library functions.",
        type: "question"
      },
      {
        question: "Which function converts time to a readable string?",
        options: ["time()", "localtime()", "ctime()", "clock()"],
        correctAnswer: 2,
        explanation: "ctime() converts a time_t value to a human-readable string.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-errors",
  title: "C++ Errors",
  description: "Learn about common C++ errors and how to identify them.",
  difficulty: "Advanced",
  baseXP: 450,
  baselineTime: 2,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Syntax error",
        content: "A missing semicolon causes a syntax error.",
        code: "#include <iostream>\nint main() {\n    std::cout << \"Hello\" << std::endl\n    return 0;\n}",
        explanation: "Compiler will report a syntax error due to the missing semicolon.",
        type: "theory"
      },
      {
        title: "Example 2: Type mismatch error",
        content: "Assigning incompatible types triggers an error.",
        code: "int x = \"text\";",
        explanation: "C++ is statically typed; types must match exactly.",
        type: "theory"
      },
      {
        title: "Example 3: Logic error",
        content: "Program runs but produces incorrect results.",
        code: "int sum = 5 - 3; // Intended to add\nstd::cout << sum;",
        explanation: "Logic errors are mistakes in the program’s reasoning.",
        type: "theory"
      },
      {
        title: "Example 4: Runtime error",
        content: "Divide by zero triggers a runtime error.",
        code: "int a = 5, b = 0;\nstd::cout << a / b;",
        explanation: "Runtime errors occur during execution, e.g., division by zero.",
        type: "theory"
      },
      {
        question: "Which type of error occurs when the program compiles but gives wrong results?",
        options: ["Syntax error", "Logic error", "Runtime error", "Compilation error"],
        correctAnswer: 1,
        explanation: "Logic errors happen when code runs but produces incorrect output.",
        type: "question"
      },
      {
        question: "What causes a runtime error?",
        options: ["Missing semicolon", "Type mismatch", "Divide by zero", "Wrong logic"],
        correctAnswer: 2,
        explanation: "Runtime errors happen during execution, e.g., dividing by zero.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-debugging",
  title: "C++ Debugging",
  description: "Learn basic techniques for finding and fixing bugs in C++ code.",
  difficulty: "Advanced",
  baseXP: 470,
  baselineTime: 2,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Using std::cout",
        content: "Print variable values to debug.",
        code: "int x = 5;\nstd::cout << \"x = \" << x << std::endl;",
        explanation: "Printing values helps track program flow and variable states.",
        type: "theory"
      },
      {
        title: "Example 2: Debugging with breakpoints",
        content: "Pause execution at a specific line in an IDE.",
        code: "// Set breakpoint in IDE at the next line\nint y = x + 2;",
        explanation: "Breakpoints let you inspect variables and program flow step by step.",
        type: "theory"
      },
      {
        title: "Example 3: Using assert",
        content: "Check conditions at runtime.",
        code: "#include <cassert>\nint main() {\n    int a = 5;\n    assert(a > 0);\n    return 0;\n}",
        explanation: "assert() stops program if the condition is false, useful for debugging.",
        type: "theory"
      },
      {
        title: "Example 4: Debugging logic with temporary variables",
        content: "Use temporary variables to isolate issues.",
        code: "int sum = 0;\nint a = 5, b = 10;\nsum = a + b;\nstd::cout << sum;",
        explanation: "Breaking expressions into steps helps identify where errors occur.",
        type: "theory"
      },
      {
        question: "Which function can check runtime conditions during debugging?",
        options: ["cout", "assert", "cin", "endl"],
        correctAnswer: 1,
        explanation: "assert() stops execution if a condition fails, helping debugging.",
        type: "question"
      },
      {
        question: "Why are breakpoints useful?",
        options: ["Run program faster", "Inspect variables step by step", "Hide errors", "Skip code lines"],
        correctAnswer: 1,
        explanation: "Breakpoints let you pause execution and check program state.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-exceptions",
  title: "C++ Exceptions",
  description: "Learn how to handle runtime errors using exceptions in C++.",
  difficulty: "Advanced",
  baseXP: 490,
  baselineTime: 2,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic try-catch",
        content: "Catch exceptions to prevent crashes.",
        code: "#include <iostream>\nint main() {\n    try {\n        throw 10;\n    } catch(int e) {\n        std::cout << \"Caught: \" << e;\n    }\n    return 0;\n}",
        explanation: "try-catch blocks handle errors gracefully.",
        type: "theory"
      },
      {
        title: "Example 2: Catch multiple exception types",
        content: "Handle different exceptions separately.",
        code: "#include <iostream>\nint main() {\n    try {\n        throw 'a';\n    } catch(int e) {\n        std::cout << \"Int\";\n    } catch(char e) {\n        std::cout << \"Char\";\n    }\n    return 0;\n}",
        explanation: "Multiple catch blocks allow handling various error types.",
        type: "theory"
      },
      {
        title: "Example 3: Catch all exceptions",
        content: "Use catch(...) to handle any exception.",
        code: "#include <iostream>\nint main() {\n    try {\n        throw 5.5;\n    } catch(...) {\n        std::cout << \"Unknown exception caught\";\n    }\n    return 0;\n}",
        explanation: "catch(...) is a generic handler for unexpected exceptions.",
        type: "theory"
      },
      {
        title: "Example 4: Throwing exceptions in functions",
        content: "Functions can throw exceptions.",
        code: "#include <iostream>\nvoid divide(int a, int b) {\n    if(b==0) throw \"Divide by zero\";\n    std::cout << a/b;\n}\nint main() {\n    try { divide(5,0); } catch(const char* e) { std::cout << e; }\n    return 0;\n}",
        explanation: "Functions can signal errors using throw, which can be caught outside.",
        type: "theory"
      },
      {
        question: "Which keyword is used to throw an exception?",
        options: ["catch", "throw", "try", "error"],
        correctAnswer: 1,
        explanation: "throw is used to signal an exception.",
        type: "question"
      },
      {
        question: "What does catch(...) do?",
        options: ["Catches integer exceptions", "Catches all exceptions", "Catches char exceptions", "Stops program"],
        correctAnswer: 1,
        explanation: "catch(...) catches any type of exception not previously handled.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-input-validation",
  title: "C++ Input Validation",
  description: "Learn how to check user input and handle invalid entries in C++.",
  difficulty: "Advanced",
  baseXP: 510,
  baselineTime: 2,
  language: "cpp",
  category: "C++",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Check integer input",
        content: "Ensure user enters an integer.",
        code: "#include <iostream>\nint main() {\n    int x;\n    std::cout << \"Enter a number: \";\n    while(!(std::cin >> x)) {\n        std::cout << \"Invalid input! Try again: \";\n        std::cin.clear();\n        std::cin.ignore(10000, '\\n');\n    }\n    std::cout << \"You entered: \" << x;\n    return 0;\n}",
        explanation: "Use cin.fail() and clear() to validate input and avoid infinite loops.",
        type: "theory"
      },
      {
        title: "Example 2: Check range",
        content: "Ensure number is within a specific range.",
        code: "int age;\ndo {\n    std::cout << \"Enter age (1-120): \";\n    std::cin >> age;\n} while(age < 1 || age > 120);\nstd::cout << \"Age is valid: \" << age;",
        explanation: "Loop until input meets criteria.",
        type: "theory"
      },
      {
        title: "Example 3: Validate char input",
        content: "Accept only specific characters.",
        code: "char choice;\ndo {\n    std::cout << \"Enter Y or N: \";\n    std::cin >> choice;\n} while(choice != 'Y' && choice != 'N');\nstd::cout << \"You chose: \" << choice;",
        explanation: "Validation can be applied to characters as well.",
        type: "theory"
      },
      {
        title: "Example 4: Validate string input",
        content: "Check string length.",
        code: "std::string name;\ndo {\n    std::cout << \"Enter your name (max 10 chars): \";\n    std::cin >> name;\n} while(name.length() > 10);\nstd::cout << \"Name accepted: \" << name;",
        explanation: "Input validation applies to strings too, e.g., length or format.",
        type: "theory"
      },
      {
        question: "Which function clears the input buffer after invalid input?",
        options: ["cin.clear()", "cin.ignore()", "cin.fail()", "cin.get()"],
        correctAnswer: 1,
        explanation: "cin.ignore() skips unwanted characters to prevent infinite loops.",
        type: "question"
      },
      {
        question: "Why is input validation important?",
        options: ["To prevent incorrect data", "To speed up program", "To avoid using variables", "To make code shorter"],
        correctAnswer: 0,
        explanation: "Validation ensures the program receives expected and safe input.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-vectors",
  title: "C++ Vectors",
  description: "Learn about vectors in C++ for dynamic arrays.",
  difficulty: "Advanced",
  baseXP: 530,
  baselineTime: 2,
  language: "cpp",
  category: "C++ Data Structures",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declare and initialize vector",
        content: "Create a vector of integers.",
        code: "#include <vector>\n#include <iostream>\nint main() {\n    std::vector<int> nums = {1,2,3};\n    for(int n : nums) std::cout << n << ' ';\n    return 0;\n}",
        explanation: "Vectors store elements dynamically and allow easy iteration.",
        type: "theory"
      },
      {
        title: "Example 2: Add elements with push_back",
        content: "Add new elements to the vector.",
        code: "std::vector<int> nums;\nnums.push_back(10);\nnums.push_back(20);\nfor(int n : nums) std::cout << n << ' ';",
        explanation: "push_back adds elements at the end of the vector.",
        type: "theory"
      },
      {
        title: "Example 3: Access elements",
        content: "Use [] or at() to access elements.",
        code: "std::cout << nums[0];\nstd::cout << nums.at(1);",
        explanation: "at() checks bounds; [] does not.",
        type: "theory"
      },
      {
        title: "Example 4: Remove last element",
        content: "Use pop_back to remove the last item.",
        code: "nums.pop_back();",
        explanation: "pop_back removes the last element and reduces size.",
        type: "theory"
      },
      {
        question: "Which function adds an element to the end of a vector?",
        options: ["insert()", "push_back()", "append()", "add()"],
        correctAnswer: 1,
        explanation: "push_back() appends elements at the end.",
        type: "question"
      },
      {
        question: "What happens if you access vector.at() out of bounds?",
        options: ["Undefined behavior", "Returns 0", "Throws exception", "Compiles error"],
        correctAnswer: 2,
        explanation: "at() throws an out_of_range exception if index is invalid.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-list",
  title: "C++ List",
  description: "Learn about lists in C++ for doubly-linked dynamic collections.",
  difficulty: "Advanced",
  baseXP: 550,
  baselineTime: 2,
  language: "cpp",
  category: "C++ Data Structures",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declare and initialize list",
        content: "Create a list of integers.",
        code: "#include <list>\n#include <iostream>\nint main() {\n    std::list<int> nums = {1,2,3};\n    for(int n : nums) std::cout << n << ' ';\n    return 0;\n}",
        explanation: "Lists store elements in a doubly-linked structure, allowing efficient insertions/removals.",
        type: "theory"
      },
      {
        title: "Example 2: Add elements",
        content: "Use push_back() and push_front() to add elements.",
        code: "nums.push_back(4);\nnums.push_front(0);",
        explanation: "push_back adds to end; push_front adds to the start.",
        type: "theory"
      },
      {
        title: "Example 3: Remove elements",
        content: "Remove elements from front or back.",
        code: "nums.pop_back();\nnums.pop_front();",
        explanation: "pop_back and pop_front remove elements efficiently at ends.",
        type: "theory"
      },
      {
        title: "Example 4: Iterate with iterator",
        content: "Use iterator to traverse list.",
        code: "for(std::list<int>::iterator it = nums.begin(); it != nums.end(); ++it) std::cout << *it << ' ';",
        explanation: "Iterators allow safe traversal and manipulation of list elements.",
        type: "theory"
      },
      {
        question: "Which list function adds an element at the beginning?",
        options: ["push_back()", "push_front()", "insert()", "emplace_back()"],
        correctAnswer: 1,
        explanation: "push_front() adds an element to the start of the list.",
        type: "question"
      },
      {
        question: "What type of structure is std::list in C++?",
        options: ["Array", "Vector", "Doubly-linked list", "Stack"],
        correctAnswer: 2,
        explanation: "std::list is implemented as a doubly-linked list.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-stacks",
  title: "C++ Stacks",
  description: "Learn about stack data structure in C++.",
  difficulty: "Advanced",
  baseXP: 570,
  baselineTime: 2,
  language: "cpp",
  category: "C++ Data Structures",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declare stack",
        content: "Create a stack of integers.",
        code: "#include <stack>\n#include <iostream>\nint main() {\n    std::stack<int> s;\n    s.push(10);\n    s.push(20);\n    std::cout << s.top();\n    return 0;\n}",
        explanation: "Stacks follow LIFO (Last In, First Out) principle.",
        type: "theory"
      },
      {
        title: "Example 2: Add elements",
        content: "Use push() to add elements.",
        code: "s.push(30);",
        explanation: "push() adds an element to the top of the stack.",
        type: "theory"
      },
      {
        title: "Example 3: Remove elements",
        content: "Use pop() to remove the top element.",
        code: "s.pop();",
        explanation: "pop() removes the element at the top of the stack.",
        type: "theory"
      },
      {
        title: "Example 4: Check top and empty",
        content: "Use top() to see top element and empty() to check if stack is empty.",
        code: "if(!s.empty()) std::cout << s.top();",
        explanation: "top() gives the current element without removing it; empty() returns true if stack has no elements.",
        type: "theory"
      },
      {
        question: "Which stack function removes the top element?",
        options: ["pop()", "push()", "top()", "empty()"],
        correctAnswer: 0,
        explanation: "pop() removes the top element from a stack.",
        type: "question"
      },
      {
        question: "What principle does a stack follow?",
        options: ["FIFO", "LIFO", "Random", "Priority-based"],
        correctAnswer: 1,
        explanation: "Stack is Last In, First Out (LIFO).",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-queues",
  title: "C++ Queues",
  description: "Learn about queue data structure in C++.",
  difficulty: "Advanced",
  baseXP: 590,
  baselineTime: 2,
  language: "cpp",
  category: "C++ Data Structures",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declare queue",
        content: "Create a queue of integers.",
        code: "#include <queue>\n#include <iostream>\nint main() {\n    std::queue<int> q;\n    q.push(1);\n    q.push(2);\n    std::cout << q.front();\n    return 0;\n}",
        explanation: "Queues follow FIFO (First In, First Out) principle.",
        type: "theory"
      },
      {
        title: "Example 2: Add elements",
        content: "Use push() to add elements at the back.",
        code: "q.push(3);",
        explanation: "push() adds an element at the end of the queue.",
        type: "theory"
      },
      {
        title: "Example 3: Remove elements",
        content: "Use pop() to remove the front element.",
        code: "q.pop();",
        explanation: "pop() removes the element at the front of the queue.",
        type: "theory"
      },
      {
        title: "Example 4: Check front and empty",
        content: "Use front() to see first element and empty() to check if queue is empty.",
        code: "if(!q.empty()) std::cout << q.front();",
        explanation: "front() gives the first element; empty() checks if queue has no elements.",
        type: "theory"
      },
      {
        question: "Which queue function removes the first element?",
        options: ["pop()", "push()", "front()", "back()"],
        correctAnswer: 0,
        explanation: "pop() removes the first element from a queue.",
        type: "question"
      },
      {
        question: "What principle does a queue follow?",
        options: ["LIFO", "FIFO", "Random", "Priority-based"],
        correctAnswer: 1,
        explanation: "Queue is First In, First Out (FIFO).",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-sets",
  title: "C++ Sets",
  description: "Learn about set data structure in C++.",
  difficulty: "Advanced",
  baseXP: 610,
  baselineTime: 2,
  language: "cpp",
  category: "C++ Data Structures",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declare set",
        content: "Create a set of integers.",
        code: "#include <set>\n#include <iostream>\nint main() {\n    std::set<int> s = {3,1,2};\n    for(int n : s) std::cout << n << ' ';\n    return 0;\n}",
        explanation: "Sets store unique elements in sorted order.",
        type: "theory"
      },
      {
        title: "Example 2: Add elements",
        content: "Use insert() to add elements.",
        code: "s.insert(4);\ns.insert(2);",
        explanation: "insert() adds element only if it doesn't already exist.",
        type: "theory"
      },
      {
        title: "Example 3: Remove elements",
        content: "Use erase() to remove a specific element.",
        code: "s.erase(1);",
        explanation: "erase() removes an element from the set if it exists.",
        type: "theory"
      },
      {
        title: "Example 4: Check size and find",
        content: "Use size() to get number of elements and find() to check existence.",
        code: "if(s.find(3) != s.end()) std::cout << 'Found';",
        explanation: "find() returns an iterator; size() returns the number of elements.",
        type: "theory"
      },
      {
        question: "Which set function adds an element if it doesn't exist?",
        options: ["insert()", "push_back()", "add()", "emplace()"],
        correctAnswer: 0,
        explanation: "insert() adds a unique element to a set.",
        type: "question"
      },
      {
        question: "Are duplicate elements allowed in std::set?",
        options: ["Yes", "No", "Sometimes", "Only for integers"],
        correctAnswer: 1,
        explanation: "std::set stores only unique elements.",
        type: "question"
      }
    ]
  }
},
{
  id: "cpp-maps",
  title: "C++ Maps",
  description: "Learn about map (key-value) data structure in C++.",
  difficulty: "Advanced",
  baseXP: 630,
  baselineTime: 2,
  language: "cpp",
  category: "C++ Data Structures",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declare map",
        content: "Create a map of string to int.",
        code: "#include <map>\n#include <iostream>\nint main() {\n    std::map<std::string,int> ages;\n    ages[\"Alice\"] = 25;\n    ages[\"Bob\"] = 30;\n    std::cout << ages[\"Alice\"];\n    return 0;\n}",
        explanation: "Maps store key-value pairs with unique keys.",
        type: "theory"
      },
      {
        title: "Example 2: Insert elements",
        content: "Use insert() to add a pair.",
        code: "ages.insert({\"Charlie\", 20});",
        explanation: "insert() adds a key-value pair if key is not present.",
        type: "theory"
      },
      {
        title: "Example 3: Remove elements",
        content: "Use erase() to remove by key.",
        code: "ages.erase(\"Bob\");",
        explanation: "erase() removes a pair using its key.",
        type: "theory"
      },
      {
        title: "Example 4: Check size and find",
        content: "Use size() and find() to inspect elements.",
        code: "if(ages.find(\"Alice\") != ages.end()) std::cout << 'Found';",
        explanation: "find() returns iterator to element or end() if not found.",
        type: "theory"
      },
      {
        question: "Which function removes an element from a map?",
        options: ["erase()", "remove()", "pop()", "delete()"],
        correctAnswer: 0,
        explanation: "erase() removes an element by its key.",
        type: "question"
      },
      {
        question: "Are map keys unique in C++?",
        options: ["Yes", "No", "Depends on type", "Only strings"],
        correctAnswer: 0,
        explanation: "Map keys must be unique; duplicate keys are not allowed.",
        type: "question"
      }
    ]
  }
}



]

export const javaLessons: Lesson[] = [  
  {
  id: "java-intro",
  title: "Java Intro",
  description: "Learn the basics of Java programming language.",
  difficulty: "Beginner",
  baseXP: 50,
  baselineTime: 1,
  language: "java",
  category: "Java Basics",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: What is Java?",
        content: "Java is a high-level, object-oriented programming language used for many types of applications.",
        code: "// No code needed",
        explanation: "Understanding the purpose and history of Java is the first step.",
        type: "theory"
      },
      {
        title: "Example 2: Java Platform",
        content: "Java programs run on the Java Virtual Machine (JVM), making them platform-independent.",
        code: "// No code needed",
        explanation: "The JVM allows Java to run on any operating system without modification.",
        type: "theory"
      },
      {
        title: "Example 3: Java Applications",
        content: "Java is used for web applications, mobile apps, desktop software, and more.",
        code: "// No code needed",
        explanation: "Knowing practical uses helps motivate learning Java.",
        type: "theory"
      },
      {
        title: "Example 4: Java Syntax Basics",
        content: "Java syntax is similar to C/C++ but simpler in many ways.",
        code: "// No code needed",
        explanation: "Understanding syntax rules prepares you for writing Java code.",
        type: "theory"
      },
      {
        question: "What platform allows Java to run on any operating system?",
        options: ["JVM", "JDK", "IDE", "Compiler"],
        correctAnswer: 0,
        explanation: "The JVM (Java Virtual Machine) ensures platform independence.",
        type: "question"
      },
      {
        question: "Which of the following is NOT a common use of Java?",
        options: ["Web apps", "Mobile apps", "Desktop apps", "Operating system kernel"],
        correctAnswer: 3,
        explanation: "Java is not typically used to write OS kernels.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-get-started",
  title: "Java Get Started",
  description: "Set up Java and run your first program.",
  difficulty: "Beginner",
  baseXP: 55,
  baselineTime: 1,
  language: "java",
  category: "Java Basics",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Install JDK",
        content: "Download and install Java Development Kit (JDK) to compile and run Java code.",
        code: "// No code needed",
        explanation: "JDK is required to develop and run Java applications.",
        type: "theory"
      },
      {
        title: "Example 2: Use an IDE",
        content: "You can use IDEs like IntelliJ IDEA, Eclipse, or VS Code to write Java programs efficiently.",
        code: "// No code needed",
        explanation: "An IDE helps write, run, and debug Java code faster.",
        type: "theory"
      },
      {
        title: "Example 3: Hello World Program",
        content: "Write a simple program to print 'Hello, World!'",
        code: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}",
        explanation: "This is the simplest Java program to test your setup and understand the structure.",
        type: "theory"
      },
      {
        title: "Example 4: Compile and Run",
        content: "Compile using `javac` and run with `java` commands in terminal.",
        code: "// Compile: javac Main.java\n// Run: java Main",
        explanation: "You must compile Java code before running it, unless using an IDE.",
        type: "theory"
      },
      {
        question: "Which software allows you to compile and run Java programs?",
        options: ["JDK", "JVM", "IDE", "JRE"],
        correctAnswer: 0,
        explanation: "The JDK contains the compiler needed to build Java programs.",
        type: "question"
      },
      {
        question: "What is the purpose of System.out.println in Java?",
        options: ["Read input", "Print output", "Compile code", "Declare variables"],
        correctAnswer: 1,
        explanation: "System.out.println prints output to the console.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-syntax",
  title: "Java Syntax",
  description: "Learn the basic syntax rules of Java.",
  difficulty: "Beginner",
  baseXP: 60,
  baselineTime: 1,
  language: "java",
  category: "Java Basics",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Class Structure",
        content: "Every Java program has at least one class containing a main method.",
        code: "public class Main {\n    public static void main(String[] args) {\n        // code here\n    }\n}",
        explanation: "The class is the basic building block in Java.",
        type: "theory"
      },
      {
        title: "Example 2: Semicolons",
        content: "Statements end with a semicolon `;` in Java.",
        code: "int x = 5;\nSystem.out.println(x);",
        explanation: "Semicolons tell the compiler where a statement ends.",
        type: "theory"
      },
      {
        title: "Example 3: Case Sensitivity",
        content: "Java is case-sensitive: `MyVar` and `myvar` are different identifiers.",
        code: "int myVar = 10;\nint MyVar = 20;",
        explanation: "Always be careful with variable names and capitalization.",
        type: "theory"
      },
      {
        title: "Example 4: Identifiers",
        content: "Variable and method names must start with a letter, `$`, or `_` and cannot contain spaces.",
        code: "int score = 100;\nString playerName = \"Alice\";",
        explanation: "Follow naming rules to avoid compilation errors.",
        type: "theory"
      },
      {
        question: "Which of the following is true about Java syntax?",
        options: ["Java is not case-sensitive", "Statements end with a colon", "Classes are basic building blocks", "Variables can have spaces in names"],
        correctAnswer: 2,
        explanation: "Java classes are the fundamental structure for programs.",
        type: "question"
      },
      {
        question: "What is required at the end of most Java statements?",
        options: ["Colon", "Semicolon", "Comma", "Period"],
        correctAnswer: 1,
        explanation: "Most statements must end with a semicolon `;` in Java.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-output",
  title: "Java Output",
  description: "Learn how to display output in Java programs.",
  difficulty: "Beginner",
  baseXP: 65,
  baselineTime: 1,
  language: "java",
  category: "Java Basics",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Print text",
        content: "Use System.out.println() to print text with a newline.",
        code: "System.out.println(\"Hello, Java!\");",
        explanation: "println prints text and moves to a new line automatically.",
        type: "theory"
      },
      {
        title: "Example 2: Print variables",
        content: "Print variables by including them in println.",
        code: "int x = 5;\nSystem.out.println(\"Value of x: \" + x);",
        explanation: "You can combine text and variables using `+`.",
        type: "theory"
      },
      {
        title: "Example 3: Print without newline",
        content: "Use System.out.print() to print without moving to a new line.",
        code: "System.out.print(\"Hello \");\nSystem.out.print(\"World!\");",
        explanation: "print() keeps output on the same line.",
        type: "theory"
      },
      {
        title: "Example 4: Escape sequences",
        content: "Use escape sequences like \\n and \\t in strings.",
        code: "System.out.println(\"Hello\\nWorld\");",
        explanation: "\\n adds a new line and \\t adds a tab space in output.",
        type: "theory"
      },
      {
        question: "Which method prints text and moves to a new line?",
        options: ["System.out.print()", "System.out.println()", "printf()", "echo()"],
        correctAnswer: 1,
        explanation: "System.out.println prints and moves to a new line.",
        type: "question"
      },
      {
        question: "Which escape sequence adds a new line in Java?",
        options: ["\\t", "\\n", "\\r", "\\b"],
        correctAnswer: 1,
        explanation: "\\n is used to create a new line in output.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-comments",
  title: "Java Comments",
  description: "Learn how to write comments in Java.",
  difficulty: "Beginner",
  baseXP: 70,
  baselineTime: 1,
  language: "java",
  category: "Java Basics",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Single-line comment",
        content: "Use // to write a comment on one line.",
        code: "// This is a single-line comment",
        explanation: "Single-line comments are ignored by the compiler.",
        type: "theory"
      },
      {
        title: "Example 2: Multi-line comment",
        content: "Use /* */ to write comments over multiple lines.",
        code: "/* This is a\nmulti-line comment */",
        explanation: "Multi-line comments are useful for longer explanations.",
        type: "theory"
      },
      {
        title: "Example 3: Commenting code temporarily",
        content: "Use comments to disable code without deleting it.",
        code: "// System.out.println(\"This won't run\");",
        explanation: "Temporarily commenting code helps with debugging.",
        type: "theory"
      },
      {
        title: "Example 4: Inline comment",
        content: "Add a comment at the end of a line of code.",
        code: "int x = 5; // Initialize x with 5",
        explanation: "Inline comments clarify what a line of code does.",
        type: "theory"
      },
      {
        question: "Which symbol is used for single-line comments in Java?",
        options: ["/*", "//", "#", "--"],
        correctAnswer: 1,
        explanation: "Use // for single-line comments.",
        type: "question"
      },
      {
        question: "Why would you comment out code temporarily?",
        options: ["To make it run faster", "To disable it without deleting", "To compile errors", "To create a variable"],
        correctAnswer: 1,
        explanation: "Comments can temporarily disable code for testing or debugging.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-variables",
  title: "Java Variables",
  description: "Learn how to declare and use variables in Java.",
  difficulty: "Beginner",
  baseXP: 75,
  baselineTime: 1,
  language: "java",
  category: "Java Basics",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declare an int variable",
        content: "Store whole numbers using int type.",
        code: "int age = 25;\nSystem.out.println(age);",
        explanation: "int stores integer values without decimals.",
        type: "theory"
      },
      {
        title: "Example 2: Declare a String variable",
        content: "Store text using String type.",
        code: "String name = \"Alice\";\nSystem.out.println(name);",
        explanation: "String stores sequences of characters (text).",
        type: "theory"
      },
      {
        title: "Example 3: Declare multiple variables",
        content: "You can declare multiple variables of the same type in one line.",
        code: "int x = 5, y = 10, z = 15;\nSystem.out.println(x + y + z);",
        explanation: "Multiple variables can be declared and initialized together.",
        type: "theory"
      },
      {
        title: "Example 4: Update a variable",
        content: "Change the value of a variable after declaration.",
        code: "int x = 10;\nx = 20;\nSystem.out.println(x);",
        explanation: "Variables can be reassigned new values after declaration.",
        type: "theory"
      },
      {
        question: "Which type of variable stores whole numbers without decimals?",
        options: ["int", "double", "String", "boolean"],
        correctAnswer: 0,
        explanation: "int is used for integer values.",
        type: "question"
      },
      {
        question: "Can a variable’s value be changed after declaration?",
        options: ["Yes", "No", "Only for Strings", "Only for int"],
        correctAnswer: 0,
        explanation: "Variables in Java can be reassigned new values unless declared final.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-data-types",
  title: "Java Data Types",
  description: "Learn the basic data types in Java.",
  difficulty: "Beginner",
  baseXP: 80,
  baselineTime: 1,
  language: "java",
  category: "Java Basics",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: int type",
        content: "Store integers using int.",
        code: "int age = 30;",
        explanation: "int is used for whole numbers.",
        type: "theory"
      },
      {
        title: "Example 2: double type",
        content: "Store decimal numbers using double.",
        code: "double price = 99.99;",
        explanation: "double stores numbers with decimals.",
        type: "theory"
      },
      {
        title: "Example 3: char type",
        content: "Store a single character using char.",
        code: "char grade = 'A';",
        explanation: "char holds a single character inside single quotes.",
        type: "theory"
      },
      {
        title: "Example 4: boolean type",
        content: "Store true or false using boolean.",
        code: "boolean isJavaFun = true;",
        explanation: "boolean stores only true or false values.",
        type: "theory"
      },
      {
        question: "Which data type stores decimal numbers?",
        options: ["int", "double", "char", "boolean"],
        correctAnswer: 1,
        explanation: "double stores numbers with decimals.",
        type: "question"
      },
      {
        question: "Which data type can only be true or false?",
        options: ["int", "double", "boolean", "char"],
        correctAnswer: 2,
        explanation: "boolean can only hold true or false.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-type-casting",
  title: "Java Type Casting",
  description: "Learn how to convert one data type to another in Java.",
  difficulty: "Beginner",
  baseXP: 85,
  baselineTime: 1,
  language: "java",
  category: "Java Basics",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Implicit Casting",
        content: "Convert int to double automatically.",
        code: "int x = 10;\ndouble y = x;\nSystem.out.println(y);",
        explanation: "Java automatically converts smaller types to larger types.",
        type: "theory"
      },
      {
        title: "Example 2: Explicit Casting",
        content: "Manually convert double to int.",
        code: "double price = 99.99;\nint p = (int) price;\nSystem.out.println(p);",
        explanation: "Explicit casting is needed when converting larger types to smaller types.",
        type: "theory"
      },
      {
        title: "Example 3: Casting char to int",
        content: "Get ASCII value of a character.",
        code: "char c = 'A';\nint ascii = (int) c;\nSystem.out.println(ascii);",
        explanation: "Characters can be cast to integers to get their ASCII code.",
        type: "theory"
      },
      {
        title: "Example 4: Casting int to byte",
        content: "Convert int to byte explicitly.",
        code: "int x = 130;\nbyte b = (byte) x;\nSystem.out.println(b);",
        explanation: "Explicit casting can cause data loss if value exceeds target type range.",
        type: "theory"
      },
      {
        question: "Which casting happens automatically in Java?",
        options: ["Explicit", "Implicit", "Manual", "Forced"],
        correctAnswer: 1,
        explanation: "Implicit casting happens automatically when converting smaller types to larger types.",
        type: "question"
      },
      {
        question: "Which casting may lose data if types don’t match?",
        options: ["Implicit", "Explicit", "Automatic", "None"],
        correctAnswer: 1,
        explanation: "Explicit casting can cause data loss if the target type cannot hold the value.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-operators",
  title: "Java Operators",
  description: "Learn arithmetic, assignment, comparison, and logical operators in Java.",
  difficulty: "Beginner",
  baseXP: 90,
  baselineTime: 1,
  language: "java",
  category: "Java Basics",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Arithmetic Operators",
        content: "Perform addition, subtraction, multiplication, and division.",
        code: "int a = 5, b = 2;\nSystem.out.println(a + b);\nSystem.out.println(a - b);",
        explanation: "Arithmetic operators perform basic math operations.",
        type: "theory"
      },
      {
        title: "Example 2: Assignment Operators",
        content: "Assign values using =, +=, -=, etc.",
        code: "int x = 10;\nx += 5;\nSystem.out.println(x);",
        explanation: "Assignment operators update variable values conveniently.",
        type: "theory"
      },
      {
        title: "Example 3: Comparison Operators",
        content: "Compare values using >, <, ==, !=.",
        code: "int a = 5, b = 10;\nSystem.out.println(a < b);",
        explanation: "Comparison operators return boolean results.",
        type: "theory"
      },
      {
        title: "Example 4: Logical Operators",
        content: "Combine boolean expressions using &&, ||, !.",
        code: "boolean x = true, y = false;\nSystem.out.println(x && y);",
        explanation: "Logical operators are used to combine boolean conditions.",
        type: "theory"
      },
      {
        question: "Which operator checks if two values are equal?",
        options: ["=", "==", "!=", "&&"],
        correctAnswer: 1,
        explanation: "== is used to check equality of two values.",
        type: "question"
      },
      {
        question: "Which operator combines two boolean expressions and returns true if both are true?",
        options: ["||", "&&", "!", "=="],
        correctAnswer: 1,
        explanation: "&& returns true only if both expressions are true.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-strings",
  title: "Java Strings",
  description: "Learn how to work with text using Strings in Java.",
  difficulty: "Beginner",
  baseXP: 95,
  baselineTime: 1,
  language: "java",
  category: "Java Basics",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declare a String",
        content: "Create a String variable to store text.",
        code: "String name = \"Alice\";\nSystem.out.println(name);",
        explanation: "Strings hold sequences of characters.",
        type: "theory"
      },
      {
        title: "Example 2: Concatenate Strings",
        content: "Combine two Strings using + operator.",
        code: "String first = \"Hello \";\nString second = \"World\";\nSystem.out.println(first + second);",
        explanation: "Use + to join strings together.",
        type: "theory"
      },
      {
        title: "Example 3: String Length",
        content: "Find the length of a String using .length() method.",
        code: "String text = \"Java\";\nSystem.out.println(text.length());",
        explanation: ".length() returns the number of characters in the string.",
        type: "theory"
      },
      {
        title: "Example 4: Access a Character",
        content: "Get a character at a specific index using .charAt().",
        code: "String text = \"Java\";\nSystem.out.println(text.charAt(0));",
        explanation: "charAt(index) returns the character at the given position (0-based).",
        type: "theory"
      },
      {
        question: "Which method returns the number of characters in a string?",
        options: [".size()", ".length()", ".count()", ".getLength()"],
        correctAnswer: 1,
        explanation: ".length() returns the length of a string in Java.",
        type: "question"
      },
      {
        question: "What does charAt(0) return?",
        options: ["Last character", "First character", "String length", "Entire string"],
        correctAnswer: 1,
        explanation: "charAt(0) returns the first character of the string.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-math",
  title: "Java Math",
  description: "Learn how to perform mathematical operations using the Math class.",
  difficulty: "Beginner",
  baseXP: 100,
  baselineTime: 1,
  language: "java",
  category: "Java Basics",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Absolute Value",
        content: "Use Math.abs() to get the absolute value.",
        code: "int x = -10;\nSystem.out.println(Math.abs(x));",
        explanation: "Math.abs() returns the positive value of a number.",
        type: "theory"
      },
      {
        title: "Example 2: Power",
        content: "Use Math.pow() to calculate powers.",
        code: "System.out.println(Math.pow(2, 3));",
        explanation: "Math.pow(a, b) returns a raised to the power b.",
        type: "theory"
      },
      {
        title: "Example 3: Square Root",
        content: "Use Math.sqrt() to calculate square root.",
        code: "System.out.println(Math.sqrt(16));",
        explanation: "Math.sqrt() returns the square root of a number.",
        type: "theory"
      },
      {
        title: "Example 4: Round a Number",
        content: "Use Math.round() to round to nearest integer.",
        code: "System.out.println(Math.round(4.6));",
        explanation: "Math.round() rounds a decimal to the nearest whole number.",
        type: "theory"
      },
      {
        question: "Which Math method returns the square root of a number?",
        options: ["Math.pow()", "Math.sqrt()", "Math.abs()", "Math.round()"],
        correctAnswer: 1,
        explanation: "Math.sqrt() returns the square root.",
        type: "question"
      },
      {
        question: "What does Math.abs(-5) return?",
        options: ["-5", "5", "0", "Error"],
        correctAnswer: 1,
        explanation: "Math.abs() returns the absolute value, which is 5.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-booleans",
  title: "Java Booleans",
  description: "Learn how to use boolean values in Java.",
  difficulty: "Beginner",
  baseXP: 105,
  baselineTime: 1,
  language: "java",
  category: "Java Basics",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declare a boolean",
        content: "Store true or false in a variable.",
        code: "boolean isJavaFun = true;\nSystem.out.println(isJavaFun);",
        explanation: "Booleans only store true or false values.",
        type: "theory"
      },
      {
        title: "Example 2: Comparison returning boolean",
        content: "Use comparison operators to get boolean results.",
        code: "int a = 5, b = 10;\nSystem.out.println(a < b);",
        explanation: "Comparisons like <, >, == return boolean values.",
        type: "theory"
      },
      {
        title: "Example 3: Logical AND",
        content: "Combine conditions using && operator.",
        code: "boolean x = true, y = false;\nSystem.out.println(x && y);",
        explanation: "&& returns true only if both conditions are true.",
        type: "theory"
      },
      {
        title: "Example 4: Logical OR and NOT",
        content: "Use || and ! operators for boolean logic.",
        code: "boolean a = true, b = false;\nSystem.out.println(a || b);\nSystem.out.println(!a);",
        explanation: "|| returns true if at least one condition is true; ! negates the boolean value.",
        type: "theory"
      },
      {
        question: "Which boolean operator returns true only if both values are true?",
        options: ["&&", "||", "!", "=="],
        correctAnswer: 0,
        explanation: "&& (AND) returns true only if both operands are true.",
        type: "question"
      },
      {
        question: "What does !true evaluate to?",
        options: ["true", "false", "Error", "1"],
        correctAnswer: 1,
        explanation: "! negates a boolean, so !true becomes false.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-if-else",
  title: "Java If...Else",
  description: "Learn how to make decisions in Java using if and else statements.",
  difficulty: "Beginner",
  baseXP: 110,
  baselineTime: 1,
  language: "java",
  category: "Java Control Flow",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic if statement",
        content: "Execute code if a condition is true.",
        code: "int age = 18;\nif(age >= 18) {\n    System.out.println(\"Adult\");\n}",
        explanation: "The code inside if runs only if the condition evaluates to true.",
        type: "theory"
      },
      {
        title: "Example 2: if-else statement",
        content: "Provide alternative code if condition is false.",
        code: "int age = 16;\nif(age >= 18) {\n    System.out.println(\"Adult\");\n} else {\n    System.out.println(\"Minor\");\n}",
        explanation: "Else block runs when the if condition is false.",
        type: "theory"
      },
      {
        title: "Example 3: if-else if-else",
        content: "Check multiple conditions in sequence.",
        code: "int score = 85;\nif(score >= 90) {\n    System.out.println(\"A\");\n} else if(score >= 80) {\n    System.out.println(\"B\");\n} else {\n    System.out.println(\"C\");\n}",
        explanation: "Use else if to check additional conditions after the first if.",
        type: "theory"
      },
      {
        title: "Example 4: Nested if",
        content: "Place an if statement inside another if.",
        code: "int num = 10;\nif(num > 0) {\n    if(num % 2 == 0) {\n        System.out.println(\"Positive even number\");\n    }\n}",
        explanation: "You can nest if statements for multiple layers of conditions.",
        type: "theory"
      },
      {
        question: "Which statement executes only when the condition is true?",
        options: ["else", "if", "switch", "for"],
        correctAnswer: 1,
        explanation: "if runs code only when the condition is true.",
        type: "question"
      },
      {
        question: "Which structure allows multiple conditions to be checked in sequence?",
        options: ["if", "if-else", "if-else if-else", "switch"],
        correctAnswer: 2,
        explanation: "if-else if-else allows multiple conditions to be evaluated in order.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-switch",
  title: "Java Switch",
  description: "Learn how to select code to run from multiple options using switch statements.",
  difficulty: "Beginner",
  baseXP: 115,
  baselineTime: 1,
  language: "java",
  category: "Java Control Flow",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic switch",
        content: "Run code depending on a variable value.",
        code: "int day = 3;\nswitch(day) {\n    case 1:\n        System.out.println(\"Monday\");\n        break;\n    case 2:\n        System.out.println(\"Tuesday\");\n        break;\n    case 3:\n        System.out.println(\"Wednesday\");\n        break;\n}",
        explanation: "Switch matches the variable with a case and executes its code until break.",
        type: "theory"
      },
      {
        title: "Example 2: switch with default",
        content: "Provide a default action if no cases match.",
        code: "int day = 7;\nswitch(day) {\n    case 1: System.out.println(\"Monday\"); break;\n    default: System.out.println(\"Invalid day\");\n}",
        explanation: "Default executes when none of the case values match.",
        type: "theory"
      },
      {
        title: "Example 3: Multiple cases for same code",
        content: "Execute the same code for multiple cases.",
        code: "char grade = 'B';\nswitch(grade) {\n    case 'A':\n    case 'B':\n        System.out.println(\"Pass\");\n        break;\n    case 'C':\n        System.out.println(\"Average\");\n        break;\n}",
        explanation: "You can stack cases to execute the same block of code.",
        type: "theory"
      },
      {
        title: "Example 4: Switch with Strings",
        content: "Switch can also work with strings.",
        code: "String color = \"Red\";\nswitch(color) {\n    case \"Red\": System.out.println(\"Stop\"); break;\n    case \"Green\": System.out.println(\"Go\"); break;\n}",
        explanation: "Since Java 7, switch works with strings as well as integers and chars.",
        type: "theory"
      },
      {
        question: "Which keyword ends the execution of a case in switch?",
        options: ["exit", "stop", "break", "return"],
        correctAnswer: 2,
        explanation: "break stops execution inside a switch case.",
        type: "question"
      },
      {
        question: "Which block executes if no case matches in a switch?",
        options: ["else", "default", "case 0", "finally"],
        correctAnswer: 1,
        explanation: "The default block executes when no other case matches.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-while-loop",
  title: "Java While Loop",
  description: "Learn how to repeat code as long as a condition is true using while loops.",
  difficulty: "Beginner",
  baseXP: 120,
  baselineTime: 1,
  language: "java",
  category: "Java Loops",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic while loop",
        content: "Repeat code while a condition is true.",
        code: "int i = 1;\nwhile(i <= 5) {\n    System.out.println(i);\n    i++;\n}",
        explanation: "The loop continues until the condition becomes false.",
        type: "theory"
      },
      {
        title: "Example 2: Infinite loop",
        content: "A loop without changing condition can run forever.",
        code: "while(true) {\n    System.out.println(\"Running\");\n}",
        explanation: "Without updating variables, the condition never becomes false.",
        type: "theory"
      },
      {
        title: "Example 3: Loop with break",
        content: "Stop a loop early using break.",
        code: "int i = 1;\nwhile(i <= 10) {\n    if(i == 5) break;\n    System.out.println(i);\n    i++;\n}",
        explanation: "break exits the loop immediately.",
        type: "theory"
      },
      {
        title: "Example 4: Loop with continue",
        content: "Skip an iteration using continue.",
        code: "int i = 0;\nwhile(i < 5) {\n    i++;\n    if(i == 3) continue;\n    System.out.println(i);\n}",
        explanation: "continue skips the rest of the current iteration and moves to next.",
        type: "theory"
      },
      {
        question: "Which statement stops a loop immediately?",
        options: ["continue", "break", "exit", "stop"],
        correctAnswer: 1,
        explanation: "break ends the loop immediately.",
        type: "question"
      },
      {
        question: "Which statement skips the rest of current iteration in a loop?",
        options: ["break", "continue", "return", "exit"],
        correctAnswer: 1,
        explanation: "continue moves to the next iteration of the loop.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-for-loop",
  title: "Java For Loop",
  description: "Learn how to repeat code a specific number of times using for loops.",
  difficulty: "Beginner",
  baseXP: 125,
  baselineTime: 1,
  language: "java",
  category: "Java Loops",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic for loop",
        content: "Repeat code for a fixed number of times.",
        code: "for(int i = 1; i <= 5; i++) {\n    System.out.println(i);\n}",
        explanation: "for loop has initialization, condition, and increment in one line.",
        type: "theory"
      },
      {
        title: "Example 2: Decrementing for loop",
        content: "Count down using a for loop.",
        code: "for(int i = 5; i >= 1; i--) {\n    System.out.println(i);\n}",
        explanation: "You can decrement the loop variable instead of incrementing it.",
        type: "theory"
      },
      {
        title: "Example 3: Loop over array",
        content: "Use for loop to iterate over array elements.",
        code: "int[] nums = {1,2,3};\nfor(int i = 0; i < nums.length; i++) {\n    System.out.println(nums[i]);\n}",
        explanation: "for loop is often used to access array elements using index.",
        type: "theory"
      },
      {
        title: "Example 4: Nested for loop",
        content: "Use one loop inside another.",
        code: "for(int i = 1; i <= 3; i++) {\n    for(int j = 1; j <= 2; j++) {\n        System.out.println(i + \",\" + j);\n    }\n}",
        explanation: "Nested loops allow multiple layers of repetition.",
        type: "theory"
      },
      {
        question: "Which parts make up the for loop header?",
        options: ["Initialization, condition, increment", "Start, stop, step", "If, else, continue", "Init, check, break"],
        correctAnswer: 0,
        explanation: "A for loop header has initialization, condition, and increment/decrement.",
        type: "question"
      },
      {
        question: "Which loop is suitable for iterating over arrays using an index?",
        options: ["while", "do-while", "for", "if-else"],
        correctAnswer: 2,
        explanation: "for loops are ideal for array iteration using index.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-break-continue",
  title: "Java Break/Continue",
  description: "Learn how to control loop flow using break and continue statements.",
  difficulty: "Intermediate",
  baseXP: 140,
  baselineTime: 1.5,
  language: "java",
  category: "Java Loops",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: break in for loop",
        content: "Stop loop when a condition is met.",
        code: "for(int i = 1; i <= 10; i++) {\n    if(i == 5) break;\n    System.out.println(i);\n}",
        explanation: "break exits the loop immediately when i equals 5.",
        type: "theory"
      },
      {
        title: "Example 2: continue in for loop",
        content: "Skip an iteration when a condition is met.",
        code: "for(int i = 1; i <= 5; i++) {\n    if(i == 3) continue;\n    System.out.println(i);\n}",
        explanation: "continue skips printing 3 and moves to next iteration.",
        type: "theory"
      },
      {
        title: "Example 3: break in while loop",
        content: "Stop a while loop early.",
        code: "int i = 1;\nwhile(i <= 10) {\n    if(i == 6) break;\n    System.out.println(i);\n    i++;\n}",
        explanation: "break exits the loop when condition is met.",
        type: "theory"
      },
      {
        title: "Example 4: continue in while loop",
        content: "Skip an iteration inside while loop.",
        code: "int i = 0;\nwhile(i < 5) {\n    i++;\n    if(i == 3) continue;\n    System.out.println(i);\n}",
        explanation: "continue skips printing 3 and continues with the next iteration.",
        type: "theory"
      },
      {
        question: "Which statement skips the current iteration in a loop?",
        options: ["break", "continue", "stop", "exit"],
        correctAnswer: 1,
        explanation: "continue moves the loop to the next iteration immediately.",
        type: "question"
      },
      {
        question: "Which statement exits the loop completely?",
        options: ["break", "continue", "next", "skip"],
        correctAnswer: 0,
        explanation: "break ends the loop entirely.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-arrays",
  title: "Java Arrays",
  description: "Learn how to store multiple values of the same type using arrays in Java.",
  difficulty: "Intermediate",
  baseXP: 150,
  baselineTime: 1.5,
  language: "java",
  category: "Java Collections",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declare and initialize array",
        content: "Create an array of integers with 5 elements.",
        code: "int[] numbers = {1, 2, 3, 4, 5};\nSystem.out.println(numbers[0]);",
        explanation: "Arrays store multiple elements of the same type, indexed from 0.",
        type: "theory"
      },
      {
        title: "Example 2: Access and modify array elements",
        content: "Change the value of an element at a specific index.",
        code: "numbers[2] = 10;\nSystem.out.println(numbers[2]);",
        explanation: "Use index to access and modify array elements.",
        type: "theory"
      },
      {
        title: "Example 3: Loop through an array",
        content: "Print all elements of the array using a for loop.",
        code: "for(int i = 0; i < numbers.length; i++) {\n    System.out.println(numbers[i]);\n}",
        explanation: "Use the length property and a for loop to iterate through array elements.",
        type: "theory"
      },
      {
        title: "Example 4: Enhanced for loop",
        content: "Use the for-each loop to access elements.",
        code: "for(int num : numbers) {\n    System.out.println(num);\n}",
        explanation: "Enhanced for loop simplifies iteration over arrays.",
        type: "theory"
      },
      {
        question: "How are elements accessed in an array?",
        options: ["By key", "By index", "By value", "By position name"],
        correctAnswer: 1,
        explanation: "Array elements are accessed using their index.",
        type: "question"
      },
      {
        question: "Which loop is specifically designed for iterating all array elements easily?",
        options: ["while", "for-each", "do-while", "switch"],
        correctAnswer: 1,
        explanation: "The for-each loop iterates over all elements without using an index.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-arraylist",
  title: "Java ArrayList",
  description: "Learn about dynamic arrays in Java using ArrayList.",
  difficulty: "Intermediate",
  baseXP: 160,
  baselineTime: 1.5,
  language: "java",
  category: "Java Collections",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declare ArrayList",
        content: "Create an ArrayList of Strings.",
        code: "import java.util.ArrayList;\nArrayList<String> names = new ArrayList<>();\nnames.add(\"Alice\");\nnames.add(\"Bob\");",
        explanation: "ArrayList stores elements dynamically and allows duplicates.",
        type: "theory"
      },
      {
        title: "Example 2: Access elements",
        content: "Get elements using get() method.",
        code: "System.out.println(names.get(0));",
        explanation: "Use get(index) to retrieve an element at a specific position.",
        type: "theory"
      },
      {
        title: "Example 3: Remove elements",
        content: "Remove an element from the ArrayList.",
        code: "names.remove(\"Bob\");",
        explanation: "remove() deletes the first occurrence of the specified element.",
        type: "theory"
      },
      {
        title: "Example 4: Iterate using for-each loop",
        content: "Loop through all elements in ArrayList.",
        code: "for(String name : names) {\n    System.out.println(name);\n}",
        explanation: "for-each loop works for ArrayList just like arrays.",
        type: "theory"
      },
      {
        question: "Which method adds an element to an ArrayList?",
        options: ["append()", "add()", "insert()", "push()"],
        correctAnswer: 1,
        explanation: "add() inserts elements into an ArrayList.",
        type: "question"
      },
      {
        question: "Can ArrayList store elements of different types directly?",
        options: ["Yes", "No", "Only objects", "Only primitives"],
        correctAnswer: 1,
        explanation: "ArrayList is type-specific if generics are used; cannot store mixed types directly.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-linkedlist",
  title: "Java LinkedList",
  description: "Learn about LinkedList, a doubly-linked dynamic data structure in Java.",
  difficulty: "Intermediate",
  baseXP: 170,
  baselineTime: 1.5,
  language: "java",
  category: "Java Collections",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declare LinkedList",
        content: "Create a LinkedList of integers.",
        code: "import java.util.LinkedList;\nLinkedList<Integer> nums = new LinkedList<>();\nnums.add(10);\nnums.add(20);",
        explanation: "LinkedList allows dynamic storage and fast insertions/removals.",
        type: "theory"
      },
      {
        title: "Example 2: Access elements",
        content: "Use get() to retrieve elements.",
        code: "System.out.println(nums.get(1));",
        explanation: "LinkedList supports get(index), similar to ArrayList, but slower for large lists.",
        type: "theory"
      },
      {
        title: "Example 3: Add elements at start or end",
        content: "Use addFirst() and addLast() methods.",
        code: "nums.addFirst(5);\nnums.addLast(30);",
        explanation: "LinkedList provides special methods to add at beginning or end efficiently.",
        type: "theory"
      },
      {
        title: "Example 4: Remove elements",
        content: "Remove first, last, or specific elements.",
        code: "nums.removeFirst();\nnums.removeLast();",
        explanation: "LinkedList has convenient methods to remove elements from either end.",
        type: "theory"
      },
      {
        question: "Which LinkedList method adds an element at the beginning?",
        options: ["addFirst()", "addStart()", "insert(0)", "prepend()"],
        correctAnswer: 0,
        explanation: "addFirst() inserts an element at the start of the list.",
        type: "question"
      },
      {
        question: "Compared to ArrayList, LinkedList is faster at which operation?",
        options: ["Random access", "Sequential traversal", "Insertions and deletions in middle", "Sorting"],
        correctAnswer: 2,
        explanation: "LinkedList handles insertions and deletions efficiently at any position.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-set",
  title: "Java Set",
  description: "Learn about the Set interface in Java which stores unique elements.",
  difficulty: "Intermediate",
  baseXP: 180,
  baselineTime: 1.5,
  language: "java",
  category: "Java Collections",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declare a Set",
        content: "Create a Set of Strings.",
        code: "import java.util.HashSet;\nimport java.util.Set;\nSet<String> fruits = new HashSet<>();\nfruits.add(\"Apple\");\nfruits.add(\"Banana\");",
        explanation: "Set stores unique elements; duplicates are ignored.",
        type: "theory"
      },
      {
        title: "Example 2: Check for element",
        content: "Use contains() to see if an element exists.",
        code: "System.out.println(fruits.contains(\"Apple\"));",
        explanation: "contains() checks whether a value exists in the Set.",
        type: "theory"
      },
      {
        title: "Example 3: Remove element",
        content: "Remove an element from the Set.",
        code: "fruits.remove(\"Banana\");",
        explanation: "remove() deletes the element if present.",
        type: "theory"
      },
      {
        title: "Example 4: Iterate through a Set",
        content: "Loop through all elements using for-each.",
        code: "for(String fruit : fruits) {\n    System.out.println(fruit);\n}",
        explanation: "Use for-each to iterate since Sets do not have indexes.",
        type: "theory"
      },
      {
        question: "Can a Set store duplicate elements?",
        options: ["Yes", "No", "Depends on type", "Only numbers"],
        correctAnswer: 1,
        explanation: "Sets only allow unique elements.",
        type: "question"
      },
      {
        question: "Which method checks if a Set contains a specific element?",
        options: ["contains()", "has()", "exists()", "find()"],
        correctAnswer: 0,
        explanation: "The contains() method checks for element existence.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-hashset",
  title: "Java HashSet",
  description: "Learn about HashSet, a popular implementation of the Set interface.",
  difficulty: "Intermediate",
  baseXP: 190,
  baselineTime: 1.5,
  language: "java",
  category: "Java Collections",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declare HashSet",
        content: "Create a HashSet of integers.",
        code: "import java.util.HashSet;\nHashSet<Integer> numbers = new HashSet<>();\nnumbers.add(10);\nnumbers.add(20);",
        explanation: "HashSet stores unique elements with no guaranteed order.",
        type: "theory"
      },
      {
        title: "Example 2: Add elements",
        content: "Add more numbers to HashSet.",
        code: "numbers.add(30);\nnumbers.add(40);",
        explanation: "add() inserts elements dynamically.",
        type: "theory"
      },
      {
        title: "Example 3: Remove elements",
        content: "Remove a number from HashSet.",
        code: "numbers.remove(20);",
        explanation: "remove() deletes the element if it exists.",
        type: "theory"
      },
      {
        title: "Example 4: Iterate through HashSet",
        content: "Print all elements using for-each loop.",
        code: "for(int num : numbers) {\n    System.out.println(num);\n}",
        explanation: "HashSet can be iterated using for-each even though order is not guaranteed.",
        type: "theory"
      },
      {
        question: "Does HashSet maintain element insertion order?",
        options: ["Yes", "No", "Only for Strings", "Depends on JVM"],
        correctAnswer: 1,
        explanation: "HashSet does not preserve insertion order.",
        type: "question"
      },
      {
        question: "What happens if you add a duplicate element to a HashSet?",
        options: ["It replaces the old value", "It ignores the new value", "Throws error", "Duplicates are allowed"],
        correctAnswer: 1,
        explanation: "Duplicates are ignored; only unique elements are stored.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-treeset",
  title: "Java TreeSet",
  description: "Learn about TreeSet, which stores unique elements in sorted order.",
  difficulty: "Intermediate",
  baseXP: 200,
  baselineTime: 1.5,
  language: "java",
  category: "Java Collections",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declare TreeSet",
        content: "Create a TreeSet of Strings.",
        code: "import java.util.TreeSet;\nTreeSet<String> names = new TreeSet<>();\nnames.add(\"Charlie\");\nnames.add(\"Alice\");\nnames.add(\"Bob\");",
        explanation: "TreeSet stores elements in natural ascending order automatically.",
        type: "theory"
      },
      {
        title: "Example 2: Access first and last elements",
        content: "Get smallest and largest elements.",
        code: "System.out.println(names.first());\nSystem.out.println(names.last());",
        explanation: "TreeSet provides first() and last() to access boundary elements.",
        type: "theory"
      },
      {
        title: "Example 3: Remove elements",
        content: "Delete an element from TreeSet.",
        code: "names.remove(\"Alice\");",
        explanation: "Use remove() to delete a specific element.",
        type: "theory"
      },
      {
        title: "Example 4: Iterate TreeSet",
        content: "Use for-each loop to print elements.",
        code: "for(String name : names) {\n    System.out.println(name);\n}",
        explanation: "Elements are automatically printed in sorted order.",
        type: "theory"
      },
      {
        question: "In which order does TreeSet store elements?",
        options: ["Insertion order", "Random order", "Sorted ascending", "Reverse order"],
        correctAnswer: 2,
        explanation: "TreeSet stores elements in sorted ascending order.",
        type: "question"
      },
      {
        question: "Can TreeSet store duplicate elements?",
        options: ["Yes", "No", "Only Strings", "Only Integers"],
        correctAnswer: 1,
        explanation: "TreeSet allows only unique elements.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-map",
  title: "Java Map",
  description: "Learn about the Map interface in Java which stores key-value pairs.",
  difficulty: "Intermediate",
  baseXP: 210,
  baselineTime: 1.5,
  language: "java",
  category: "Java Collections",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declare a Map",
        content: "Create a Map of String to Integer.",
        code: "import java.util.Map;\nimport java.util.HashMap;\nMap<String, Integer> ages = new HashMap<>();\nages.put(\"Alice\", 25);\nages.put(\"Bob\", 30);",
        explanation: "Map stores key-value pairs; keys are unique.",
        type: "theory"
      },
      {
        title: "Example 2: Access elements",
        content: "Retrieve a value using its key.",
        code: "System.out.println(ages.get(\"Alice\"));",
        explanation: "get() retrieves the value associated with a key.",
        type: "theory"
      },
      {
        title: "Example 3: Remove elements",
        content: "Remove a key-value pair from the Map.",
        code: "ages.remove(\"Bob\");",
        explanation: "remove() deletes the entry for the given key.",
        type: "theory"
      },
      {
        title: "Example 4: Iterate over Map",
        content: "Loop through all entries using entrySet.",
        code: "for(Map.Entry<String, Integer> entry : ages.entrySet()) {\n    System.out.println(entry.getKey() + \": \" + entry.getValue());\n}",
        explanation: "entrySet() allows iteration over key-value pairs.",
        type: "theory"
      },
      {
        question: "Can a Map have duplicate keys?",
        options: ["Yes", "No", "Depends on implementation", "Only for Strings"],
        correctAnswer: 1,
        explanation: "Keys in a Map must be unique; values can be duplicated.",
        type: "question"
      },
      {
        question: "Which method retrieves a value from a Map by key?",
        options: ["get()", "fetch()", "find()", "access()"],
        correctAnswer: 0,
        explanation: "The get() method retrieves the value for a given key.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-hashmap",
  title: "Java HashMap",
  description: "Learn about HashMap, a common implementation of the Map interface in Java.",
  difficulty: "Intermediate",
  baseXP: 220,
  baselineTime: 1.5,
  language: "java",
  category: "Java Collections",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declare HashMap",
        content: "Create a HashMap of Integer keys and String values.",
        code: "import java.util.HashMap;\nHashMap<Integer, String> students = new HashMap<>();\nstudents.put(1, \"Alice\");\nstudents.put(2, \"Bob\");",
        explanation: "HashMap stores key-value pairs with no guaranteed order.",
        type: "theory"
      },
      {
        title: "Example 2: Add more entries",
        content: "Insert additional key-value pairs.",
        code: "students.put(3, \"Charlie\");",
        explanation: "put() adds or replaces values for a key.",
        type: "theory"
      },
      {
        title: "Example 3: Remove an entry",
        content: "Delete a key-value pair using remove().",
        code: "students.remove(2);",
        explanation: "remove() deletes the entry corresponding to a key.",
        type: "theory"
      },
      {
        title: "Example 4: Iterate HashMap",
        content: "Print all key-value pairs using for-each loop.",
        code: "for(Integer key : students.keySet()) {\n    System.out.println(key + \": \" + students.get(key));\n}",
        explanation: "keySet() allows iteration over keys, then get() retrieves values.",
        type: "theory"
      },
      {
        question: "Does HashMap maintain the order of elements?",
        options: ["Yes", "No", "Only Strings", "Depends on JVM"],
        correctAnswer: 1,
        explanation: "HashMap does not guarantee insertion order.",
        type: "question"
      },
      {
        question: "What happens if you put a value with an existing key?",
        options: ["It creates duplicate key", "It overwrites the old value", "Throws error", "Ignored"],
        correctAnswer: 1,
        explanation: "The new value replaces the existing value for the same key.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-treemap",
  title: "Java TreeMap",
  description: "Learn about TreeMap, which stores key-value pairs in sorted order.",
  difficulty: "Intermediate",
  baseXP: 230,
  baselineTime: 1.5,
  language: "java",
  category: "Java Collections",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Declare TreeMap",
        content: "Create a TreeMap with Integer keys and String values.",
        code: "import java.util.TreeMap;\nTreeMap<Integer, String> scores = new TreeMap<>();\nscores.put(3, \"Alice\");\nscores.put(1, \"Bob\");\nscores.put(2, \"Charlie\");",
        explanation: "TreeMap stores keys in natural ascending order.",
        type: "theory"
      },
      {
        title: "Example 2: Access first and last keys",
        content: "Retrieve the smallest and largest keys.",
        code: "System.out.println(scores.firstKey());\nSystem.out.println(scores.lastKey());",
        explanation: "firstKey() and lastKey() return boundary keys in sorted order.",
        type: "theory"
      },
      {
        title: "Example 3: Remove entry",
        content: "Remove a key-value pair using remove().",
        code: "scores.remove(2);",
        explanation: "remove() deletes the entry with the specified key.",
        type: "theory"
      },
      {
        title: "Example 4: Iterate TreeMap",
        content: "Print all entries using entrySet().",
        code: "for(Map.Entry<Integer, String> entry : scores.entrySet()) {\n    System.out.println(entry.getKey() + \": \" + entry.getValue());\n}",
        explanation: "entrySet() allows iteration in sorted key order.",
        type: "theory"
      },
      {
        question: "In which order are TreeMap keys stored?",
        options: ["Random order", "Insertion order", "Sorted ascending", "Reverse order"],
        correctAnswer: 2,
        explanation: "TreeMap stores keys in ascending order automatically.",
        type: "question"
      },
      {
        question: "Can TreeMap have duplicate keys?",
        options: ["Yes", "No", "Depends on value type", "Only integers"],
        correctAnswer: 1,
        explanation: "Keys in TreeMap must be unique.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-methods",
  title: "Java Methods",
  description: "Learn how to define and use methods in Java for reusable code.",
  difficulty: "Intermediate",
  baseXP: 240,
  baselineTime: 1.5,
  language: "java",
  category: "Java Methods",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Simple method",
        content: "Define a method to print a greeting.",
        code: "public class Main {\n    public static void greet() {\n        System.out.println(\"Hello!\");\n    }\n    public static void main(String[] args) {\n        greet();\n    }\n}",
        explanation: "Methods allow reusing code by calling them multiple times.",
        type: "theory"
      },
      {
        title: "Example 2: Method with return value",
        content: "Create a method that adds two numbers.",
        code: "public static int add(int a, int b) {\n    return a + b;\n}\npublic static void main(String[] args) {\n    System.out.println(add(5, 3));\n}",
        explanation: "Methods can return values of a specific type.",
        type: "theory"
      },
      {
        title: "Example 3: Call method multiple times",
        content: "Reuse method with different inputs.",
        code: "System.out.println(add(2, 4));\nSystem.out.println(add(7, 1));",
        explanation: "Methods make repetitive tasks easier and cleaner.",
        type: "theory"
      },
      {
        title: "Example 4: Method with no parameters",
        content: "Define method to print date info.",
        code: "public static void showDate() {\n    System.out.println(java.time.LocalDate.now());\n}",
        explanation: "Methods can have zero or multiple parameters.",
        type: "theory"
      },
      {
        question: "What is the main advantage of using methods?",
        options: ["Reuse code", "Increase errors", "Slower program", "Complex syntax"],
        correctAnswer: 0,
        explanation: "Methods allow code to be reused and organized.",
        type: "question"
      },
      {
        question: "Can a method return a value in Java?",
        options: ["Yes", "No", "Only void methods", "Only static methods"],
        correctAnswer: 0,
        explanation: "Methods can return values of the declared return type.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-method-parameters",
  title: "Java Method Parameters",
  description: "Learn how to pass data to methods using parameters.",
  difficulty: "Intermediate",
  baseXP: 250,
  baselineTime: 1.5,
  language: "java",
  category: "Java Methods",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Single parameter",
        content: "Define a method that greets a user by name.",
        code: "public static void greet(String name) {\n    System.out.println(\"Hello, \" + name + \"!\");\n}\npublic static void main(String[] args) {\n    greet(\"Alice\");\n}",
        explanation: "Method parameters allow passing information into a method.",
        type: "theory"
      },
      {
        title: "Example 2: Multiple parameters",
        content: "Add two numbers using a method with two parameters.",
        code: "public static int add(int a, int b) {\n    return a + b;\n}\npublic static void main(String[] args) {\n    System.out.println(add(5, 3));\n}",
        explanation: "Methods can have multiple parameters to receive several inputs.",
        type: "theory"
      },
      {
        title: "Example 3: Parameter order matters",
        content: "Notice the effect of switching parameter order.",
        code: "System.out.println(add(3, 5)); // 8\nSystem.out.println(add(5, 3)); // 8",
        explanation: "Parameter order affects the values passed into the method.",
        type: "theory"
      },
      {
        title: "Example 4: Using parameters in logic",
        content: "Check if a number is even or odd using a method parameter.",
        code: "public static void checkEven(int num) {\n    if(num % 2 == 0) System.out.println(num + \" is even\");\n    else System.out.println(num + \" is odd\");\n}\npublic static void main(String[] args) {\n    checkEven(7);\n}",
        explanation: "Parameters allow methods to operate on different inputs dynamically.",
        type: "theory"
      },
      {
        question: "What are method parameters used for?",
        options: ["To pass data into a method", "To return values", "To define the main class", "To import libraries"],
        correctAnswer: 0,
        explanation: "Parameters allow data to be passed into a method for processing.",
        type: "question"
      },
      {
        question: "Can a method have multiple parameters?",
        options: ["Yes", "No", "Only one allowed", "Only for static methods"],
        correctAnswer: 0,
        explanation: "Methods can have any number of parameters.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-method-overloading",
  title: "Java Method Overloading",
  description: "Learn how to define multiple methods with the same name but different parameters.",
  difficulty: "Intermediate",
  baseXP: 260,
  baselineTime: 1.5,
  language: "java",
  category: "Java Methods",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Overload with different parameter types",
        content: "Define two add() methods: one with int, one with double.",
        code: "public static int add(int a, int b) { return a + b; }\npublic static double add(double a, double b) { return a + b; }\npublic static void main(String[] args) {\n    System.out.println(add(2,3));\n    System.out.println(add(2.5,3.5));\n}",
        explanation: "Overloaded methods differ in parameter types or numbers but share the same name.",
        type: "theory"
      },
      {
        title: "Example 2: Overload with different number of parameters",
        content: "Add a method with three int parameters.",
        code: "public static int add(int a, int b, int c) { return a + b + c; }\nSystem.out.println(add(1,2,3));",
        explanation: "Method overloading can vary the number of parameters as well.",
        type: "theory"
      },
      {
        title: "Example 3: Call correct overload automatically",
        content: "Java chooses the method based on argument types.",
        code: "System.out.println(add(5, 7)); // calls int version\nSystem.out.println(add(2.0, 3.0)); // calls double version",
        explanation: "Java selects the appropriate overloaded method automatically.",
        type: "theory"
      },
      {
        title: "Example 4: Overloading and return types",
        content: "Return type alone cannot overload a method.",
        code: "// Invalid: public static double add(int a, int b) { return a+b; } // conflicts with int add(int,int)",
        explanation: "Methods must differ in parameters; return type alone is not enough.",
        type: "theory"
      },
      {
        question: "Can methods be overloaded by changing only the return type?",
        options: ["Yes", "No", "Only if static", "Only if void"],
        correctAnswer: 1,
        explanation: "Overloading requires different parameters; return type alone cannot overload a method.",
        type: "question"
      },
      {
        question: "How does Java select which overloaded method to call?",
        options: ["Based on parameter types and number", "Randomly", "Based on return type", "Always calls first defined method"],
        correctAnswer: 0,
        explanation: "Java selects the correct overload using the arguments' types and number.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-scope",
  title: "Java Scope",
  description: "Learn about variable scope and visibility in Java.",
  difficulty: "Intermediate",
  baseXP: 270,
  baselineTime: 1.5,
  language: "java",
  category: "Java Methods",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Local scope",
        content: "A variable declared inside a method is local to that method.",
        code: "public static void main(String[] args) {\n    int x = 10; // local to main\n    System.out.println(x);\n}",
        explanation: "Local variables exist only within the block where they are defined.",
        type: "theory"
      },
      {
        title: "Example 2: Block scope",
        content: "Variables inside loops or if blocks are local to that block.",
        code: "if(true) {\n    int y = 5;\n    System.out.println(y);\n}\n// y is not accessible here",
        explanation: "Variables declared inside {} are not visible outside.",
        type: "theory"
      },
      {
        title: "Example 3: Global/instance variables",
        content: "Variables declared in class but outside methods are accessible to all methods of that class.",
        code: "static int z = 100;\npublic static void main(String[] args) {\n    System.out.println(z);\n}",
        explanation: "Static or instance variables have wider scope than local variables.",
        type: "theory"
      },
      {
        title: "Example 4: Shadowing",
        content: "Local variable can hide class variable temporarily.",
        code: "static int a = 10;\npublic static void main(String[] args) {\n    int a = 5;\n    System.out.println(a); // prints 5, not 10\n}",
        explanation: "Local variable takes precedence over class variable in the same scope.",
        type: "theory"
      },
      {
        question: "Where is a local variable visible?",
        options: ["Inside its block", "Entire class", "Across files", "Globally"],
        correctAnswer: 0,
        explanation: "Local variables are only visible inside the block they are declared in.",
        type: "question"
      },
      {
        question: "What happens when a local variable has the same name as a class variable?",
        options: ["Local variable shadows class variable", "Compiler error", "Class variable is deleted", "Global variable overrides both"],
        correctAnswer: 0,
        explanation: "Local variable temporarily hides the class variable inside its scope.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-recursion",
  title: "Java Recursion",
  description: "Learn how methods can call themselves to solve problems iteratively.",
  difficulty: "Intermediate",
  baseXP: 280,
  baselineTime: 1.5,
  language: "java",
  category: "Java Methods",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Simple recursion",
        content: "Method calls itself to print numbers down from n.",
        code: "public static void printNumbers(int n) {\n    if(n <= 0) return;\n    System.out.println(n);\n    printNumbers(n-1);\n}\npublic static void main(String[] args) {\n    printNumbers(5);\n}",
        explanation: "Recursion repeats a method call until a base condition is met.",
        type: "theory"
      },
      {
        title: "Example 2: Factorial calculation",
        content: "Recursive factorial function.",
        code: "public static int factorial(int n) {\n    if(n==0) return 1;\n    return n * factorial(n-1);\n}\nSystem.out.println(factorial(5));",
        explanation: "Recursion is often used in mathematical problems like factorials.",
        type: "theory"
      },
      {
        title: "Example 3: Fibonacci series",
        content: "Recursive Fibonacci method.",
        code: "public static int fib(int n) {\n    if(n<=1) return n;\n    return fib(n-1)+fib(n-2);\n}\nSystem.out.println(fib(6));",
        explanation: "Recursion can elegantly solve series calculations.",
        type: "theory"
      },
      {
        title: "Example 4: Base case importance",
        content: "Without a base case, recursion causes infinite calls.",
        code: "// public static void infinite() {\n//    infinite();\n// }\n// infinite(); // StackOverflowError",
        explanation: "Always define a base condition to stop recursion.",
        type: "theory"
      },
      {
        question: "Why is a base case necessary in recursion?",
        options: ["To stop the recursive calls", "To start recursion", "To make method static", "To allocate memory"],
        correctAnswer: 0,
        explanation: "Without a base case, recursion would continue infinitely, causing an error.",
        type: "question"
      },
      {
        question: "What does the factorial method return for n=0?",
        options: ["1", "0", "n", "Error"],
        correctAnswer: 0,
        explanation: "By definition, factorial of 0 is 1.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-oop",
  title: "Java OOP",
  description: "Learn the basics of Object-Oriented Programming (OOP) in Java.",
  difficulty: "Intermediate",
  baseXP: 290,
  baselineTime: 1.5,
  language: "java",
  category: "Java Classes",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: OOP concept",
        content: "Understand objects and classes as the core of OOP.",
        code: "// Class is blueprint, object is instance\nclass Car {\n    String color;\n}\npublic class Main {\n    public static void main(String[] args) {\n        Car car1 = new Car();\n        car1.color = \"Red\";\n        System.out.println(car1.color);\n    }\n}",
        explanation: "OOP organizes code around objects which have attributes and behaviors.",
        type: "theory"
      },
      {
        title: "Example 2: Abstraction in OOP",
        content: "Classes hide complexity and expose only relevant behavior.",
        code: "abstract class Vehicle {\n    abstract void start();\n}\nclass Bike extends Vehicle {\n    void start() {\n        System.out.println(\"Bike starts\");\n    }\n}\nVehicle v = new Bike();\nv.start();",
        explanation: "Abstraction simplifies interaction with objects by hiding internal details.",
        type: "theory"
      },
      {
        title: "Example 3: Encapsulation",
        content: "Restrict direct access to fields using private access modifiers.",
        code: "class Person {\n    private String name;\n    public void setName(String n) { name = n; }\n    public String getName() { return name; }\n}\nPerson p = new Person();\np.setName(\"Alice\");\nSystem.out.println(p.getName());",
        explanation: "Encapsulation protects data and exposes controlled access.",
        type: "theory"
      },
      {
        title: "Example 4: Inheritance",
        content: "Create a new class that inherits properties from another class.",
        code: "class Animal {\n    void eat() { System.out.println(\"Eating\"); }\n}\nclass Dog extends Animal {\n    void bark() { System.out.println(\"Barking\"); }\n}\nDog d = new Dog();\nd.eat();\nd.bark();",
        explanation: "Inheritance allows reusing existing code and extending functionality.",
        type: "theory"
      },
      {
        question: "What is the main purpose of OOP?",
        options: ["Organize code around objects", "Write only functions", "Avoid classes", "Use static methods exclusively"],
        correctAnswer: 0,
        explanation: "OOP is designed to model real-world entities as objects with attributes and behaviors.",
        type: "question"
      },
      {
        question: "Which OOP principle restricts direct access to data?",
        options: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"],
        correctAnswer: 0,
        explanation: "Encapsulation controls access to fields using access modifiers.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-classes-objects",
  title: "Java Classes/Objects",
  description: "Learn how to define classes and create objects in Java.",
  difficulty: "Intermediate",
  baseXP: 300,
  baselineTime: 1.5,
  language: "java",
  category: "Java Classes",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Define a class",
        content: "Create a simple class representing a Book.",
        code: "class Book {\n    String title;\n    String author;\n}\nBook b = new Book();\nb.title = \"Java Basics\";\nb.author = \"Alice\";\nSystem.out.println(b.title + \" by \" + b.author);",
        explanation: "A class is a blueprint for creating objects.",
        type: "theory"
      },
      {
        title: "Example 2: Create multiple objects",
        content: "Instantiate multiple books from the same class.",
        code: "Book b1 = new Book();\nBook b2 = new Book();\nb1.title = \"Java 101\";\nb2.title = \"OOP Concepts\";\nSystem.out.println(b1.title + \", \" + b2.title);",
        explanation: "Objects are separate instances of the same class, each with its own data.",
        type: "theory"
      },
      {
        title: "Example 3: Object behavior",
        content: "Add a method to display book info.",
        code: "class Book {\n    String title;\n    void display() { System.out.println(\"Title: \" + title); }\n}\nBook b = new Book();\nb.title = \"Java\";\nb.display();",
        explanation: "Objects can have both attributes and behaviors (methods).",
        type: "theory"
      },
      {
        title: "Example 4: Null object reference",
        content: "Be aware that uninitialized objects are null.",
        code: "Book b = null;\n// System.out.println(b.title); // Throws NullPointerException",
        explanation: "Always initialize objects before accessing their members.",
        type: "theory"
      },
      {
        question: "What does a class represent in Java?",
        options: ["Blueprint for objects", "A single object", "A method", "An array"],
        correctAnswer: 0,
        explanation: "A class defines the structure and behavior that objects of that type will have.",
        type: "question"
      },
      {
        question: "What happens if you access a method on a null object?",
        options: ["NullPointerException", "Returns 0", "Prints default values", "Compiles successfully"],
        correctAnswer: 0,
        explanation: "Uninitialized object references are null and cannot call methods.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-class-attributes",
  title: "Java Class Attributes",
  description: "Learn about fields (attributes) in Java classes.",
  difficulty: "Intermediate",
  baseXP: 310,
  baselineTime: 1.5,
  language: "java",
  category: "Java Classes",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Instance attributes",
        content: "Each object has its own copy of instance attributes.",
        code: "class Car {\n    String color;\n}\nCar c1 = new Car();\nCar c2 = new Car();\nc1.color = \"Red\";\nc2.color = \"Blue\";\nSystem.out.println(c1.color + \", \" + c2.color);",
        explanation: "Instance attributes belong to specific objects, not the class itself.",
        type: "theory"
      },
      {
        title: "Example 2: Class (static) attributes",
        content: "Static fields are shared across all objects.",
        code: "class Car {\n    static int wheels = 4;\n}\nCar c1 = new Car();\nCar c2 = new Car();\nSystem.out.println(Car.wheels);",
        explanation: "Static attributes belong to the class, not individual instances.",
        type: "theory"
      },
      {
        title: "Example 3: Default values",
        content: "Uninitialized attributes get default values.",
        code: "class Car {\n    int speed;\n    boolean running;\n}\nCar c = new Car();\nSystem.out.println(c.speed + \", \" + c.running);",
        explanation: "Numeric defaults to 0, boolean to false, objects to null.",
        type: "theory"
      },
      {
        title: "Example 4: Access modifiers for attributes",
        content: "Attributes can be private, protected, or public.",
        code: "class Car {\n    private String model;\n}\n// Only accessible via getter/setter methods",
        explanation: "Modifiers control access and encapsulation.",
        type: "theory"
      },
      {
        question: "What is the difference between instance and static attributes?",
        options: ["Instance belongs to object, static belongs to class", "Instance belongs to class, static to object", "Both are same", "Static is private only"],
        correctAnswer: 0,
        explanation: "Static attributes are shared across all objects; instance attributes are individual per object.",
        type: "question"
      },
      {
        question: "What is the default value of a boolean attribute?",
        options: ["false", "0", "null", "true"],
        correctAnswer: 0,
        explanation: "Boolean attributes default to false if uninitialized.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-class-methods",
  title: "Java Class Methods",
  description: "Learn how to define and use methods in Java classes.",
  difficulty: "Advanced",
  baseXP: 330,
  baselineTime: 2,
  language: "java",
  category: "Java Classes",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Define a method",
        content: "Add a method to a class to display a message.",
        code: "class Greeter {\n    void greet() {\n        System.out.println(\"Hello!\");\n    }\n}\nGreeter g = new Greeter();\ng.greet();",
        explanation: "Methods define behavior for objects.",
        type: "theory"
      },
      {
        title: "Example 2: Method with parameters",
        content: "Methods can take arguments for dynamic behavior.",
        code: "class Greeter {\n    void greet(String name) {\n        System.out.println(\"Hello, \" + name);\n    }\n}\nGreeter g = new Greeter();\ng.greet(\"Alice\");",
        explanation: "Parameters allow passing data to methods.",
        type: "theory"
      },
      {
        title: "Example 3: Method with return value",
        content: "Methods can return values to the caller.",
        code: "class MathUtil {\n    int square(int n) { return n*n; }\n}\nMathUtil m = new MathUtil();\nSystem.out.println(m.square(5));",
        explanation: "Return values allow methods to produce results.",
        type: "theory"
      },
      {
        title: "Example 4: Method overloading",
        content: "Multiple methods can have the same name but different parameters.",
        code: "class Calculator {\n    int add(int a, int b) { return a+b; }\n    double add(double a, double b) { return a+b; }\n}\nCalculator c = new Calculator();\nSystem.out.println(c.add(2,3));\nSystem.out.println(c.add(2.5,3.5));",
        explanation: "Overloading allows multiple behaviors under the same method name.",
        type: "theory"
      },
      {
        question: "What is the purpose of a method in a class?",
        options: ["Define object behavior", "Store data only", "Create variables", "Make objects static"],
        correctAnswer: 0,
        explanation: "Methods define the behavior (actions) that objects of the class can perform.",
        type: "question"
      },
      {
        question: "What allows a method to return a value to the caller?",
        options: ["return statement", "void keyword", "static keyword", "class name"],
        correctAnswer: 0,
        explanation: "The return statement sends a value back to the caller.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-constructors",
  title: "Java Constructors",
  description: "Learn how to use constructors to initialize objects.",
  difficulty: "Advanced",
  baseXP: 350,
  baselineTime: 2,
  language: "java",
  category: "Java Classes",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Default constructor",
        content: "A constructor with no parameters is called automatically.",
        code: "class Person {\n    String name;\n    Person() {\n        name = \"Unknown\";\n    }\n}\nPerson p = new Person();\nSystem.out.println(p.name);",
        explanation: "Constructors initialize object attributes when created.",
        type: "theory"
      },
      {
        title: "Example 2: Parameterized constructor",
        content: "Pass values to the constructor during object creation.",
        code: "class Person {\n    String name;\n    Person(String n) {\n        name = n;\n    }\n}\nPerson p = new Person(\"Alice\");\nSystem.out.println(p.name);",
        explanation: "Parameterized constructors allow setting custom initial values.",
        type: "theory"
      },
      {
        title: "Example 3: Multiple constructors",
        content: "A class can have multiple constructors with different parameters.",
        code: "class Person {\n    String name;\n    int age;\n    Person() { name=\"Unknown\"; age=0; }\n    Person(String n, int a) { name=n; age=a; }\n}\nPerson p1 = new Person();\nPerson p2 = new Person(\"Bob\", 25);",
        explanation: "Constructor overloading allows multiple ways to initialize objects.",
        type: "theory"
      },
      {
        title: "Example 4: Constructor vs method",
        content: "Constructors do not have a return type and match the class name.",
        code: "// See previous examples, note the lack of return type",
        explanation: "Constructors are special methods used only for initialization.",
        type: "theory"
      },
      {
        question: "What is the main role of a constructor?",
        options: ["Initialize objects", "Call other methods", "Store values permanently", "Create static variables"],
        correctAnswer: 0,
        explanation: "Constructors automatically set up objects when they are created.",
        type: "question"
      },
      {
        question: "Can a class have more than one constructor?",
        options: ["Yes, using different parameters", "No, only one allowed", "Only with static methods", "Only private constructors"],
        correctAnswer: 0,
        explanation: "Java supports constructor overloading to allow multiple ways to initialize objects.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-this-keyword",
  title: "Java this Keyword",
  description: "Learn how to use the 'this' keyword to reference the current object.",
  difficulty: "Advanced",
  baseXP: 370,
  baselineTime: 2,
  language: "java",
  category: "Java Classes",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Refer to current object",
        content: "Use 'this' to access the current object's attribute.",
        code: "class Person {\n    String name;\n    void setName(String name) {\n        this.name = name;\n    }\n}\nPerson p = new Person();\np.setName(\"Alice\");\nSystem.out.println(p.name);",
        explanation: "'this' distinguishes between instance variables and parameters with the same name.",
        type: "theory"
      },
      {
        title: "Example 2: Call another constructor",
        content: "Use 'this()' to call a constructor from another constructor.",
        code: "class Person {\n    String name;\n    Person() { this(\"Unknown\"); }\n    Person(String n) { name = n; }\n}\nPerson p = new Person();\nSystem.out.println(p.name);",
        explanation: "'this()' helps to reuse constructor logic.",
        type: "theory"
      },
      {
        title: "Example 3: Pass current object as parameter",
        content: "You can send the current object to other methods or objects.",
        code: "class Printer {\n    void print(Person p) { System.out.println(p.name); }\n}\nPerson p = new Person(\"Alice\");\nPrinter pr = new Printer();\npr.print(p);",
        explanation: "'this' can be used to pass the current object reference.",
        type: "theory"
      },
      {
        title: "Example 4: Return current object",
        content: "Useful for method chaining.",
        code: "class Person {\n    String name;\n    Person setName(String n) { this.name = n; return this; }\n}\nPerson p = new Person().setName(\"Alice\");",
        explanation: "'this' allows returning the current object for fluent APIs.",
        type: "theory"
      },
      {
        question: "Why do we use 'this' inside a method?",
        options: ["To refer to the current object's attributes", "To call static methods", "To declare a class", "To make a variable global"],
        correctAnswer: 0,
        explanation: "'this' refers to the instance of the object the method is called on.",
        type: "question"
      },
      {
        question: "What does 'this()' do inside a constructor?",
        options: ["Calls another constructor of the same class", "Calls a method", "Accesses a static field", "Creates a new object"],
        correctAnswer: 0,
        explanation: "'this()' is used to call another constructor in the same class.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-modifiers",
  title: "Java Modifiers",
  description: "Learn how to control access and behavior of classes, methods, and variables using modifiers.",
  difficulty: "Advanced",
  baseXP: 390,
  baselineTime: 2,
  language: "java",
  category: "Java Classes",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Access modifiers",
        content: "Control visibility using public, private, and protected.",
        code: "class Person {\n    public String name;\n    private int age;\n    protected String address;\n}",
        explanation: "Access modifiers control which classes can see or use fields and methods.",
        type: "theory"
      },
      {
        title: "Example 2: Static modifier",
        content: "Static fields and methods belong to the class, not instances.",
        code: "class Counter {\n    static int count = 0;\n    void increment() { count++; }\n}\nCounter c1 = new Counter();\nc1.increment();\nSystem.out.println(Counter.count);",
        explanation: "Static members are shared across all instances of the class.",
        type: "theory"
      },
      {
        title: "Example 3: Final modifier",
        content: "Final variables cannot be reassigned; final methods cannot be overridden.",
        code: "final class Constants {\n    final int MAX = 100;\n}",
        explanation: "Final enforces immutability or prevents overriding.",
        type: "theory"
      },
      {
        title: "Example 4: Abstract modifier",
        content: "Abstract classes cannot be instantiated and can have abstract methods.",
        code: "abstract class Shape {\n    abstract void draw();\n}",
        explanation: "Abstract classes provide a blueprint for subclasses.",
        type: "theory"
      },
      {
        question: "Which modifier makes a field accessible from anywhere?",
        options: ["public", "private", "protected", "final"],
        correctAnswer: 0,
        explanation: "Public fields or methods are accessible from all classes.",
        type: "question"
      },
      {
        question: "What does the 'static' keyword do?",
        options: ["Makes a member belong to the class instead of instances", "Prevents reassignment", "Makes the class abstract", "Restricts access to subclasses only"],
        correctAnswer: 0,
        explanation: "Static members are shared by all instances of the class.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-encapsulation",
  title: "Java Encapsulation",
  description: "Learn how to protect and manage access to class data using encapsulation.",
  difficulty: "Advanced",
  baseXP: 410,
  baselineTime: 2,
  language: "java",
  category: "Java OOP",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Private fields",
        content: "Declare class fields as private to restrict direct access.",
        code: "class Person {\n    private String name;\n    private int age;\n}",
        explanation: "Private fields cannot be accessed directly from outside the class.",
        type: "theory"
      },
      {
        title: "Example 2: Getter and Setter methods",
        content: "Provide public methods to access and update private fields.",
        code: "class Person {\n    private String name;\n    public void setName(String name) { this.name = name; }\n    public String getName() { return this.name; }\n}\nPerson p = new Person();\np.setName(\"Alice\");\nSystem.out.println(p.getName());",
        explanation: "Getters and setters control how fields are accessed or modified.",
        type: "theory"
      },
      {
        title: "Example 3: Validation in setter",
        content: "Add checks inside setters to validate input before assigning values.",
        code: "class Person {\n    private int age;\n    public void setAge(int age) { if(age > 0) this.age = age; }\n    public int getAge() { return age; }\n}\nPerson p = new Person();\np.setAge(-5);\nSystem.out.println(p.getAge()); // 0",
        explanation: "Encapsulation allows enforcing rules when updating data.",
        type: "theory"
      },
      {
        title: "Example 4: Benefits of encapsulation",
        content: "Encapsulation improves data security and maintainability.",
        code: "// Already demonstrated in previous examples",
        explanation: "Encapsulation prevents unwanted modifications and hides implementation details.",
        type: "theory"
      },
      {
        question: "Which access modifier is typically used for encapsulated fields?",
        options: ["private", "public", "protected", "default"],
        correctAnswer: 0,
        explanation: "Private fields hide data from outside the class.",
        type: "question"
      },
      {
        question: "Why do we use getter and setter methods?",
        options: ["To control access and validation", "To make fields public", "To override methods", "To implement interfaces"],
        correctAnswer: 0,
        explanation: "Getters and setters allow controlled access to private fields.",
        type: "question"
      }
    ]
  }
},

{
  id: "java-inheritance",
  title: "Java Inheritance",
  description: "Learn how to create a new class based on an existing class using inheritance.",
  difficulty: "Advanced",
  baseXP: 430,
  baselineTime: 2,
  language: "java",
  category: "Java OOP",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Basic inheritance",
        content: "Create a subclass that inherits from a superclass.",
        code: "class Animal {\n    void eat() { System.out.println(\"Eating...\"); }\n}\nclass Dog extends Animal {\n    void bark() { System.out.println(\"Barking...\"); }\n}\nDog d = new Dog();\nd.eat();\nd.bark();",
        explanation: "The subclass inherits all methods and fields of the superclass.",
        type: "theory"
      },
      {
        title: "Example 2: Overriding methods",
        content: "Override a method in the subclass for specific behavior.",
        code: "class Animal {\n    void sound() { System.out.println(\"Some sound\"); }\n}\nclass Cat extends Animal {\n    void sound() { System.out.println(\"Meow\"); }\n}\nCat c = new Cat();\nc.sound();",
        explanation: "Overriding allows customizing inherited behavior in the subclass.",
        type: "theory"
      },
      {
        title: "Example 3: Multilevel inheritance",
        content: "A class can inherit from a subclass which in turn inherits from another class.",
        code: "class Animal { void eat(){} }\nclass Mammal extends Animal { void walk(){} }\nclass Dog extends Mammal { void bark(){} }",
        explanation: "Inheritance can form a chain of classes.",
        type: "theory"
      },
      {
        title: "Example 4: Access inherited members",
        content: "Use inherited fields or methods from the parent class.",
        code: "class Animal { String type = \"Unknown\"; }\nclass Dog extends Animal {}\nDog d = new Dog();\nSystem.out.println(d.type);",
        explanation: "Subclasses can access public and protected members of the superclass.",
        type: "theory"
      },
      {
        question: "Which keyword is used to inherit a class?",
        options: ["extends", "implements", "super", "this"],
        correctAnswer: 0,
        explanation: "The 'extends' keyword is used for class inheritance.",
        type: "question"
      },
      {
        question: "Can a subclass override a method of the superclass?",
        options: ["Yes", "No", "Only if final", "Only if static"],
        correctAnswer: 0,
        explanation: "Subclasses can override methods to provide specialized behavior.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-polymorphism",
  title: "Java Polymorphism",
  description: "Learn how objects can take multiple forms using polymorphism.",
  difficulty: "Advanced",
  baseXP: 450,
  baselineTime: 2,
  language: "java",
  category: "Java OOP",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Compile-time polymorphism",
        content: "Method overloading is a type of compile-time polymorphism.",
        code: "class Calculator {\n    int add(int a, int b) { return a+b; }\n    double add(double a, double b) { return a+b; }\n}",
        explanation: "Polymorphism allows multiple methods with the same name but different parameters.",
        type: "theory"
      },
      {
        title: "Example 2: Runtime polymorphism",
        content: "Method overriding enables runtime polymorphism.",
        code: "class Animal { void sound(){System.out.println(\"Some sound\");} }\nclass Dog extends Animal { void sound(){System.out.println(\"Bark\");} }\nAnimal a = new Dog();\na.sound();",
        explanation: "The method called is determined at runtime based on the object type.",
        type: "theory"
      },
      {
        title: "Example 3: Polymorphism with objects",
        content: "A parent class reference can hold child class objects.",
        code: "Animal a = new Dog();\nAnimal b = new Cat();\na.sound();\nb.sound();",
        explanation: "Polymorphism allows flexible object usage and reduces code duplication.",
        type: "theory"
      },
      {
        title: "Example 4: Advantages of polymorphism",
        content: "Code is more flexible and extensible.",
        code: "// Already demonstrated in previous examples",
        explanation: "Polymorphism promotes reusable and maintainable code.",
        type: "theory"
      },
      {
        question: "What is runtime polymorphism also called?",
        options: ["Method overriding", "Method overloading", "Constructor chaining", "Static method call"],
        correctAnswer: 0,
        explanation: "Overriding methods enables runtime polymorphism.",
        type: "question"
      },
      {
        question: "Can a parent class reference point to a child class object?",
        options: ["Yes", "No", "Only with interfaces", "Only if final"],
        correctAnswer: 0,
        explanation: "Parent references can hold child objects to enable polymorphism.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-super-keyword",
  title: "Java super Keyword",
  description: "Learn how to access parent class members using 'super'.",
  difficulty: "Advanced",
  baseXP: 470,
  baselineTime: 2,
  language: "java",
  category: "Java OOP",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Access parent method",
        content: "Use super.method() to call the parent class method.",
        code: "class Animal { void sound(){System.out.println(\"Some sound\");} }\nclass Dog extends Animal { void sound(){super.sound(); System.out.println(\"Bark\");} }\nDog d = new Dog();\nd.sound();",
        explanation: "'super' allows accessing parent class methods or fields.",
        type: "theory"
      },
      {
        title: "Example 2: Access parent constructor",
        content: "Use super() to call the parent class constructor.",
        code: "class Animal { Animal(String type){ System.out.println(type); } }\nclass Dog extends Animal { Dog(){ super(\"Animal\"); } }\nDog d = new Dog();",
        explanation: "'super()' invokes the constructor of the parent class.",
        type: "theory"
      },
      {
        title: "Example 3: Access parent field",
        content: "Use super.fieldName to reference parent class fields.",
        code: "class Animal { String type=\"Animal\"; }\nclass Dog extends Animal { String type=\"Dog\"; void printTypes(){ System.out.println(type); System.out.println(super.type); } }\nDog d = new Dog();\nd.printTypes();",
        explanation: "'super' distinguishes between subclass and superclass members.",
        type: "theory"
      },
      {
        title: "Example 4: Combined usage",
        content: "super can be used for fields, methods, and constructors.",
        code: "// Demonstrated in previous examples",
        explanation: "super provides clear access to parent class features.",
        type: "theory"
      },
      {
        question: "Which keyword allows a subclass to access parent class methods?",
        options: ["super", "this", "extends", "final"],
        correctAnswer: 0,
        explanation: "'super' is used to access superclass members from a subclass.",
        type: "question"
      },
      {
        question: "Can 'super()' be used to call a parent constructor?",
        options: ["Yes", "No", "Only for methods", "Only for static fields"],
        correctAnswer: 0,
        explanation: "super() is specifically used to call a parent class constructor.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-abstract-classes",
  title: "Java Abstract Classes",
  description: "Learn how to use abstract classes in Java to provide a template for subclasses.",
  difficulty: "Advanced",
  baseXP: 490,
  baselineTime: 2,
  language: "java",
  category: "Java OOP",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Abstract class",
        content: "Define abstract methods to be implemented by subclasses.",
        code: "abstract class Shape { abstract void draw(); }\nclass Circle extends Shape { void draw(){ System.out.println(\"Drawing Circle\"); } }\nShape s = new Circle();\ns.draw();",
        explanation: "Abstract classes provide a template with some implemented or unimplemented methods.",
        type: "theory"
      },
      {
        title: "Example 2: Abstract class with implemented methods",
        content: "An abstract class can also have implemented methods.",
        code: "abstract class Shape {\n    abstract void draw();\n    void info() { System.out.println(\"This is a shape\"); }\n}\nclass Circle extends Shape { void draw(){ System.out.println(\"Drawing Circle\"); } }\nShape s = new Circle();\ns.draw();\ns.info();",
        explanation: "Abstract classes can combine both abstract and concrete methods.",
        type: "theory"
      },
      {
        title: "Example 3: Using abstract class as reference",
        content: "Reference an abstract class to hold subclass objects.",
        code: "Shape s = new Circle();\ns.draw();",
        explanation: "Abstract class references allow polymorphic behavior.",
        type: "theory"
      },
      {
        title: "Example 4: Abstract class restrictions",
        content: "You cannot create instances of abstract classes directly.",
        code: "// Shape s = new Shape(); // This is illegal",
        explanation: "Abstract classes cannot be instantiated, only extended.",
        type: "theory"
      },
      {
        question: "Can you create an instance of an abstract class?",
        options: ["No", "Yes", "Only inside main()", "Only if subclass exists"],
        correctAnswer: 0,
        explanation: "Abstract classes cannot be instantiated directly.",
        type: "question"
      },
      {
        question: "Can abstract classes have implemented methods?",
        options: ["Yes", "No", "Only in interfaces", "Only if final"],
        correctAnswer: 0,
        explanation: "Abstract classes can include both abstract and concrete methods.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-interfaces",
  title: "Java Interfaces",
  description: "Learn how to use interfaces in Java to define contracts for classes.",
  difficulty: "Advanced",
  baseXP: 510,
  baselineTime: 2,
  language: "java",
  category: "Java OOP",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Interface definition",
        content: "Interfaces define methods without implementation.",
        code: "interface Drawable { void draw(); }\nclass Circle implements Drawable { public void draw(){ System.out.println(\"Drawing Circle\"); } }",
        explanation: "Interfaces allow multiple classes to implement common behavior.",
        type: "theory"
      },
      {
        title: "Example 2: Implement multiple interfaces",
        content: "A class can implement multiple interfaces for flexible design.",
        code: "interface A { void methodA(); }\ninterface B { void methodB(); }\nclass C implements A, B { public void methodA(){} public void methodB(){} }",
        explanation: "Interfaces support multiple inheritance of type.",
        type: "theory"
      },
      {
        title: "Example 3: Default and static methods (Java 8+)",
        content: "Interfaces can have default and static methods.",
        code: "interface Example {\n    default void greet() { System.out.println(\"Hello\"); }\n    static void info() { System.out.println(\"Static method\"); }\n}",
        explanation: "Java 8+ allows default implementations in interfaces.",
        type: "theory"
      },
      {
        title: "Example 4: Difference between abstract class and interface",
        content: "Abstract class can have fields and implemented methods; interfaces mostly have method declarations.",
        code: "// Explained in theory",
        explanation: "Abstract classes are partial implementations; interfaces define a contract.",
        type: "theory"
      },
      {
        question: "Can a class implement multiple interfaces?",
        options: ["Yes", "No", "Only if abstract", "Only if final"],
        correctAnswer: 0,
        explanation: "Java allows multiple interfaces to be implemented by a single class.",
        type: "question"
      },
      {
        question: "Which keyword is used to define an interface?",
        options: ["interface", "abstract", "extends", "implements"],
        correctAnswer: 0,
        explanation: "The 'interface' keyword declares an interface.",
        type: "question"
      }
    ]
  }
},

{
  id: "java-enums",
  title: "Java Enums",
  description: "Learn how to use enums in Java to represent a fixed set of constants.",
  difficulty: "Advanced",
  baseXP: 530,
  baselineTime: 2,
  language: "java",
  category: "Java OOP",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Define an enum",
        content: "Create an enum to represent days of the week.",
        code: "enum Day {\n    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY\n}\nDay today = Day.MONDAY;\nSystem.out.println(today);",
        explanation: "Enums provide a type-safe way to define a set of constant values.",
        type: "theory"
      },
      {
        title: "Example 2: Enum with methods",
        content: "Add a method to an enum for custom behavior.",
        code: "enum Day {\n    MONDAY, TUESDAY;\n    public void greet() { System.out.println(\"Hello, it's \" + this); }\n}\nDay.MONDAY.greet();",
        explanation: "Enums can have fields, methods, and constructors to add functionality.",
        type: "theory"
      },
      {
        title: "Example 3: Iterating over enum values",
        content: "Loop through all enum values.",
        code: "for(Day d : Day.values()) {\n    System.out.println(d);\n}",
        explanation: "The values() method allows iterating over all enum constants.",
        type: "theory"
      },
      {
        title: "Example 4: Using enum in switch",
        content: "Use an enum in a switch statement.",
        code: "Day today = Day.MONDAY;\nswitch(today) {\n    case MONDAY: System.out.println(\"Start of week\"); break;\n    default: System.out.println(\"Other day\");\n}",
        explanation: "Enums can be used in switch statements for cleaner code.",
        type: "theory"
      },
      {
        question: "What is the main advantage of using enums in Java?",
        options: ["Type safety for fixed constants", "Better memory usage", "Faster execution", "Allows multiple inheritance"],
        correctAnswer: 0,
        explanation: "Enums provide type safety and a clear way to define fixed constant sets.",
        type: "question"
      },
      {
        question: "Which method allows iterating over all enum constants?",
        options: ["values()", "all()", "enumerate()", "list()"],
        correctAnswer: 0,
        explanation: "The values() method returns an array of all enum constants.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-inner-classes",
  title: "Java Inner Classes",
  description: "Learn how to use inner classes to organize Java code and access outer class members.",
  difficulty: "Advanced",
  baseXP: 550,
  baselineTime: 2,
  language: "java",
  category: "Java OOP",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Define a simple inner class",
        content: "Create a class inside another class.",
        code: "class Outer {\n    class Inner {\n        void show() { System.out.println(\"Hello from Inner\"); }\n    }\n}\nOuter o = new Outer();\nOuter.Inner i = o.new Inner();\ni.show();",
        explanation: "Inner classes allow logical grouping and access to outer class members.",
        type: "theory"
      },
      {
        title: "Example 2: Inner class accessing outer class member",
        content: "Inner class can use outer class variables.",
        code: "class Outer {\n    int x = 10;\n    class Inner {\n        void printX() { System.out.println(\"x = \" + x); }\n    }\n}\nOuter o = new Outer();\nOuter.Inner i = o.new Inner();\ni.printX();",
        explanation: "Inner classes can access all members (even private) of their outer class.",
        type: "theory"
      },
      {
        title: "Example 3: Static inner class",
        content: "Define a static inner class.",
        code: "class Outer {\n    static class Inner {\n        void greet() { System.out.println(\"Hello from static Inner\"); }\n    }\n}\nOuter.Inner i = new Outer.Inner();\ni.greet();",
        explanation: "Static inner classes do not need an instance of the outer class.",
        type: "theory"
      },
      {
        title: "Example 4: Inner class benefits",
        content: "Inner classes improve encapsulation and code organization.",
        code: "// Conceptual, no code needed",
        explanation: "Using inner classes can keep related classes together and make the code more readable.",
        type: "theory"
      },
      {
        question: "What is a main benefit of inner classes?",
        options: ["Improved encapsulation and organization", "Faster execution", "Larger memory footprint", "Easier inheritance"],
        correctAnswer: 0,
        explanation: "Inner classes help group logically related classes and allow encapsulation.",
        type: "question"
      },
      {
        question: "How does a static inner class differ from a non-static inner class?",
        options: ["Does not require an outer class instance", "Cannot have methods", "Cannot be instantiated", "Automatically private"],
        correctAnswer: 0,
        explanation: "Static inner classes can be created without an outer class object.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-user-input",
  title: "Java User Input",
  description: "Learn how to get input from users using Scanner in Java.",
  difficulty: "Advanced",
  baseXP: 570,
  baselineTime: 2,
  language: "java",
  category: "Java Basics",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Input integer",
        content: "Use Scanner to read an integer from user.",
        code: "import java.util.Scanner;\nScanner sc = new Scanner(System.in);\nSystem.out.print(\"Enter a number: \");\nint num = sc.nextInt();\nSystem.out.println(\"You entered: \" + num);",
        explanation: "Scanner allows reading different types of input from the console.",
        type: "theory"
      },
      {
        title: "Example 2: Input string",
        content: "Read a line of text from the user.",
        code: "Scanner sc = new Scanner(System.in);\nSystem.out.print(\"Enter your name: \");\nString name = sc.nextLine();\nSystem.out.println(\"Hello, \" + name);",
        explanation: "nextLine() reads a full line of text including spaces.",
        type: "theory"
      },
      {
        title: "Example 3: Input multiple values",
        content: "Read multiple inputs consecutively.",
        code: "Scanner sc = new Scanner(System.in);\nSystem.out.print(\"Enter two numbers: \");\nint a = sc.nextInt();\nint b = sc.nextInt();\nSystem.out.println(a + b);",
        explanation: "You can use Scanner multiple times to read consecutive inputs.",
        type: "theory"
      },
      {
        title: "Example 4: Input validation",
        content: "Check if input is valid before using it.",
        code: "Scanner sc = new Scanner(System.in);\nSystem.out.print(\"Enter positive number: \");\nint num = sc.nextInt();\nif(num < 0) System.out.println(\"Invalid input\");",
        explanation: "Always validate user input to avoid errors.",
        type: "theory"
      },
      {
        question: "Which class is used to read user input in Java?",
        options: ["Scanner", "Input", "Reader", "System.in"],
        correctAnswer: 0,
        explanation: "Scanner is commonly used for reading input from console.",
        type: "question"
      },
      {
        question: "Which method reads a full line of text?",
        options: ["nextLine()", "nextInt()", "next()", "readLine()"],
        correctAnswer: 0,
        explanation: "nextLine() reads the entire line including spaces.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-date",
  title: "Java Date",
  description: "Learn how to work with dates and times in Java.",
  difficulty: "Advanced",
  baseXP: 590,
  baselineTime: 2,
  language: "java",
  category: "Java Basics",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Current date",
        content: "Get current date using java.util.Date.",
        code: "import java.util.Date;\nDate now = new Date();\nSystem.out.println(\"Current date: \" + now);",
        explanation: "Date class represents date and time in Java.",
        type: "theory"
      },
      {
        title: "Example 2: Using Calendar",
        content: "Get individual components of date.",
        code: "import java.util.Calendar;\nCalendar cal = Calendar.getInstance();\nint year = cal.get(Calendar.YEAR);\nint month = cal.get(Calendar.MONTH) + 1;\nSystem.out.println(\"Year: \" + year + \", Month: \" + month);",
        explanation: "Calendar class allows access to year, month, day, etc.",
        type: "theory"
      },
      {
        title: "Example 3: Formatting date",
        content: "Format date using SimpleDateFormat.",
        code: "import java.text.SimpleDateFormat;\nimport java.util.Date;\nDate now = new Date();\nSimpleDateFormat sdf = new SimpleDateFormat(\"dd-MM-yyyy\");\nSystem.out.println(sdf.format(now));",
        explanation: "SimpleDateFormat lets you display date in custom formats.",
        type: "theory"
      },
      {
        title: "Example 4: Add days to date",
        content: "Manipulate date by adding days using Calendar.",
        code: "Calendar cal = Calendar.getInstance();\ncal.add(Calendar.DAY_OF_MONTH, 5);\nSystem.out.println(\"Date after 5 days: \" + cal.getTime());",
        explanation: "Calendar allows adding or subtracting time units easily.",
        type: "theory"
      },
      {
        question: "Which class allows formatting a Date in Java?",
        options: ["SimpleDateFormat", "Calendar", "DateFormatter", "DateFormat"],
        correctAnswer: 0,
        explanation: "SimpleDateFormat is used to display Date in custom formats.",
        type: "question"
      },
      {
        question: "How can you get the current month from Calendar?",
        options: ["get(Calendar.MONTH)", "getMonth()", "Calendar.MONTH()", "currentMonth()"],
        correctAnswer: 0,
        explanation: "Calendar.MONTH returns the current month (0-based, so add 1 for display).",
        type: "question"
      }
    ]
  }
},
{
  id: "java-errors-exceptions",
  title: "Java Errors & Exceptions",
  description: "Learn the difference between errors and exceptions in Java.",
  difficulty: "Advanced",
  baseXP: 610,
  baselineTime: 2,
  language: "java",
  category: "Java Errors",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Runtime exception",
        content: "Exceptions occur during program execution.",
        code: "int a = 5 / 0; // ArithmeticException",
        explanation: "Runtime exceptions are caused by illegal operations during execution.",
        type: "theory"
      },
      {
        title: "Example 2: Checked exception",
        content: "Exceptions that must be handled at compile time.",
        code: "import java.io.*;\nFileReader fr = new FileReader(\"file.txt\");",
        explanation: "Checked exceptions require try-catch or throws declaration.",
        type: "theory"
      },
      {
        title: "Example 3: Unchecked exception",
        content: "Exceptions not checked at compile time.",
        code: "int[] arr = new int[2];\nSystem.out.println(arr[5]);",
        explanation: "Unchecked exceptions like ArrayIndexOutOfBounds occur at runtime.",
        type: "theory"
      },
      {
        title: "Example 4: Exception hierarchy",
        content: "All exceptions inherit from Throwable.",
        code: "// Throwable -> Exception -> RuntimeException",
        explanation: "Understanding hierarchy helps catch exceptions correctly.",
        type: "theory"
      },
      {
        question: "Which of the following is a checked exception?",
        options: ["FileNotFoundException", "ArithmeticException", "ArrayIndexOutOfBoundsException", "NullPointerException"],
        correctAnswer: 0,
        explanation: "Checked exceptions must be handled at compile time.",
        type: "question"
      },
      {
        question: "Which class is the parent of all exceptions?",
        options: ["Throwable", "Exception", "RuntimeException", "Error"],
        correctAnswer: 0,
        explanation: "Throwable is the superclass of all errors and exceptions in Java.",
        type: "question"
      }
    ]
  }
},
{
  id: "java-debugging",
  title: "Java Debugging",
  description: "Learn techniques to debug and find errors in Java programs.",
  difficulty: "Advanced",
  baseXP: 630,
  baselineTime: 2,
  language: "java",
  category: "Java Errors",
  isLocked: false,
  content: {
    steps: [
      {
        title: "Example 1: Using print statements",
        content: "Add prints to check variable values.",
        code: "int x = 10;\nSystem.out.println(\"Value of x: \" + x);",
        explanation: "Printing intermediate values helps trace issues.",
        type: "theory"
      },
      {
        title: "Example 2: IDE debugger",
        content: "Use breakpoints and step execution.",
        code: "// Set breakpoint on line and step through code",
        explanation: "Modern IDEs provide tools to inspect variables at runtime.",
        type: "theory"
      },
      {
        title: "Example 3: Exception stack trace",
        content: "Stack trace shows where the error occurred.",
        code: "try { int x = 5/0; } catch(Exception e) { e.printStackTrace(); }",
        explanation: "Stack trace helps locate the line causing the exception.",
        type: "theory"
      },
      {
        title: "Example 4: Code review",
        content: "Carefully read and review code for logic mistakes.",
        code: "// Review loops, conditions, and calculations",
        explanation: "Manual code review can detect logical errors missed by compiler.",
        type: "theory"
      },
      {
        question: "Which tool allows stepping through code line by line?",
        options: ["IDE debugger", "Print statements", "Stack trace", "Compiler"],
        correctAnswer: 0,
        explanation: "Debugger allows inspecting program execution line by line.",
        type: "question"
      },
      {
        question: "What is the purpose of a stack trace?",
        options: ["Locate where an exception occurred", "Speed up code", "Validate input", "Compile faster"],
        correctAnswer: 0,
        explanation: "Stack trace shows the sequence of method calls that led to an exception.",
        type: "question"
      }
    ]
  }
}

];

// Generate remaining lessons for each language
export const allLessons: Lesson[] = [
  ...pythonLessons,
  ...javascriptLessons,
  ...cppLessons,
  ...javaLessons,
  // Add more lessons here to reach 50 for each language
];

export const getLessonsByLanguage = (language: 'python' | 'javascript' | 'cpp' | 'java'): Lesson[] => {
  return allLessons.filter(lesson => lesson.language === language);
};

export const getLessonById = (id: string): Lesson | undefined => {
  return allLessons.find(lesson => lesson.id === id);
};


export const getTotalLessonsByLanguage = (language: 'python' | 'javascript' | 'cpp' | 'java'): number => {
  return getLessonsByLanguage(language).length;
};

export const getCompletedLessonsByLanguage = (language: string, completedLessons: string[]): number => {
  return completedLessons.filter(lessonId => {
    const lesson = getLessonById(lessonId);
    return lesson && lesson.language === language;
  }).length;
};