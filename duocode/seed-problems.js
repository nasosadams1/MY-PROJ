import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SUPABASE_ANON_KEY
);

const sampleProblems = [
  {
    title: 'Two Sum',
    statement: `Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.

You may assume that each input has exactly one solution, and you may not use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: nums[0] + nums[1] == 9, so return [0, 1].

Write a function called 'solution' that takes the input as a string and returns the result as a string.`,
    difficulty: 'easy',
    time_limit_seconds: 900,
    memory_limit_mb: 256,
    supported_languages: ['javascript', 'python'],
    test_cases: [
      {
        input: '[2,7,11,15], 9',
        expected_output: '[0,1]',
        weight: 1,
        hidden: false
      },
      {
        input: '[3,2,4], 6',
        expected_output: '[1,2]',
        weight: 1,
        hidden: false
      },
      {
        input: '[3,3], 6',
        expected_output: '[0,1]',
        weight: 1,
        hidden: true
      }
    ],
    tags: ['array', 'hash-table'],
    is_active: true
  },
  {
    title: 'Reverse String',
    statement: `Write a function that reverses a string.

The input string is given as a string, and you should return the reversed string.

Example:
Input: "hello"
Output: "olleh"

Example:
Input: "DuoCode"
Output: "edoCodeD"

Write a function called 'solution' that takes the input string and returns the reversed string.`,
    difficulty: 'easy',
    time_limit_seconds: 600,
    memory_limit_mb: 128,
    supported_languages: ['javascript', 'python'],
    test_cases: [
      {
        input: 'hello',
        expected_output: 'olleh',
        weight: 1,
        hidden: false
      },
      {
        input: 'DuoCode',
        expected_output: 'edoCouD',
        weight: 1,
        hidden: false
      },
      {
        input: 'a',
        expected_output: 'a',
        weight: 1,
        hidden: true
      },
      {
        input: '12345',
        expected_output: '54321',
        weight: 1,
        hidden: true
      }
    ],
    tags: ['string', 'two-pointers'],
    is_active: true
  },
  {
    title: 'Palindrome Number',
    statement: `Given an integer x, return true if x is a palindrome, and false otherwise.

A palindrome is a number that reads the same backward as forward.

Example:
Input: 121
Output: true
Explanation: 121 reads as 121 from left to right and from right to left.

Example:
Input: -121
Output: false
Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.

Write a function called 'solution' that takes an integer and returns "true" or "false".`,
    difficulty: 'easy',
    time_limit_seconds: 600,
    memory_limit_mb: 128,
    supported_languages: ['javascript', 'python'],
    test_cases: [
      {
        input: '121',
        expected_output: 'true',
        weight: 1,
        hidden: false
      },
      {
        input: '-121',
        expected_output: 'false',
        weight: 1,
        hidden: false
      },
      {
        input: '10',
        expected_output: 'false',
        weight: 1,
        hidden: true
      },
      {
        input: '12321',
        expected_output: 'true',
        weight: 1,
        hidden: true
      }
    ],
    tags: ['math', 'number'],
    is_active: true
  },
  {
    title: 'Valid Parentheses',
    statement: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Example:
Input: "()"
Output: true

Example:
Input: "()[]{}"
Output: true

Example:
Input: "(]"
Output: false

Write a function called 'solution' that takes a string and returns "true" or "false".`,
    difficulty: 'medium',
    time_limit_seconds: 900,
    memory_limit_mb: 256,
    supported_languages: ['javascript', 'python'],
    test_cases: [
      {
        input: '()',
        expected_output: 'true',
        weight: 1,
        hidden: false
      },
      {
        input: '()[]{}',
        expected_output: 'true',
        weight: 1,
        hidden: false
      },
      {
        input: '(]',
        expected_output: 'false',
        weight: 1,
        hidden: false
      },
      {
        input: '([)]',
        expected_output: 'false',
        weight: 1,
        hidden: true
      },
      {
        input: '{[]}',
        expected_output: 'true',
        weight: 1,
        hidden: true
      }
    ],
    tags: ['stack', 'string'],
    is_active: true
  },
  {
    title: 'Maximum Subarray',
    statement: `Given an integer array nums, find the subarray with the largest sum, and return its sum.

Example:
Input: [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.

Example:
Input: [1]
Output: 1
Explanation: The subarray [1] has the largest sum 1.

Write a function called 'solution' that takes an array as a string and returns the maximum sum as a string.`,
    difficulty: 'medium',
    time_limit_seconds: 900,
    memory_limit_mb: 256,
    supported_languages: ['javascript', 'python'],
    test_cases: [
      {
        input: '[-2,1,-3,4,-1,2,1,-5,4]',
        expected_output: '6',
        weight: 2,
        hidden: false
      },
      {
        input: '[1]',
        expected_output: '1',
        weight: 1,
        hidden: false
      },
      {
        input: '[5,4,-1,7,8]',
        expected_output: '23',
        weight: 2,
        hidden: true
      }
    ],
    tags: ['array', 'dynamic-programming'],
    is_active: true
  }
];

async function seedProblems() {
  console.log('Seeding problems...');

  for (const problem of sampleProblems) {
    const { data, error } = await supabase
      .from('problems')
      .select('id')
      .eq('title', problem.title)
      .maybeSingle();

    if (data) {
      console.log(`Problem "${problem.title}" already exists, skipping...`);
      continue;
    }

    const { error: insertError } = await supabase
      .from('problems')
      .insert(problem);

    if (insertError) {
      console.error(`Error inserting problem "${problem.title}":`, insertError);
    } else {
      console.log(`✓ Added problem: ${problem.title}`);
    }
  }

  console.log('Seeding complete!');
  process.exit(0);
}

seedProblems();
