// Code Runner Functionality
function initializeCodeRunner() {
  const tabs = document.querySelectorAll('.tab');
  const codeEditor = document.getElementById('code-editor');
  const runButton = document.getElementById('run-code');
  const outputWindow = document.getElementById('output');

  // Default code samples
  const codeSamples = {
    javascript: `// Reverse an array
const arr = [1, 2, 3, 4, 5];
const reversed = arr.reverse();
console.log(reversed);

// Calculate factorial
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
console.log('Factorial of 5:', factorial(5));`,

    python: `# Calculate sum of numbers
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
print(f"Sum: {total}")

# Simple function
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`
  };

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      // Add active class to clicked tab
      tab.classList.add('active');

      const language = tab.getAttribute('data-lang');
      updateCodeEditor(language);
    });
  });

  // Update code editor content
  function updateCodeEditor(language) {
    // Remove existing language classes
    codeEditor.className = codeEditor.className.replace(/language-\w+/g, '');
    // Add new language class
    codeEditor.classList.add(`language-${language}`);
    // Set content
    codeEditor.textContent = codeSamples[language];

    // Re-highlight with Prism if available
    if (window.Prism) {
      Prism.highlightElement(codeEditor);
    }
  }

  // Run code functionality
  runButton.addEventListener('click', () => {
    const activeTab = document.querySelector('.tab.active');
    const language = activeTab.getAttribute('data-lang');
    const code = codeEditor.textContent;

    outputWindow.textContent = 'Running...\n';

    if (language === 'javascript') {
      runJavaScript(code);
    } else if (language === 'python') {
      runPython(code);
    }
  });

  // JavaScript execution
  function runJavaScript(code) {
    try {
      // Capture console.log output
      let output = '';
      const originalLog = console.log;
      console.log = function(...args) {
        output += args.join(' ') + '\n';
        originalLog.apply(console, args);
      };

      // Execute the code
      eval(code);

      // Restore original console.log
      console.log = originalLog;

      outputWindow.textContent = output || 'Code executed successfully (no output)\n';
    } catch (error) {
      outputWindow.textContent = `Error: ${error.message}\n`;
    }
  }

  // Python execution using Pyodide
  async function runPython(code) {
    try {
      // Load Pyodide if not already loaded
      if (!window.pyodide) {
        outputWindow.textContent = 'Loading Python environment...\n';
        window.pyodide = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
        });
      }

      // Redirect stdout
      window.pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `);

      // Run the code
      await window.pyodide.runPythonAsync(code);

      // Get output
      const output = window.pyodide.runPython('sys.stdout.getvalue()');
      outputWindow.textContent = output || 'Code executed successfully (no output)\n';

    } catch (error) {
      outputWindow.textContent = `Error: ${error.message}\n`;
    }
  }

  // Initialize with JavaScript
  updateCodeEditor('javascript');

  // Handle keyboard shortcuts and preserve cursor position
  codeEditor.addEventListener('keydown', (e) => {
    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();

      // Get current selection
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);

      // Create a text node with two spaces
      const tabNode = document.createTextNode('  ');

      // Insert the tab
      range.insertNode(tabNode);

      // Move cursor after the inserted text
      range.setStartAfter(tabNode);
      range.setEndAfter(tabNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });

  // Handle input events to maintain syntax highlighting
  codeEditor.addEventListener('input', () => {
    // Re-highlight after user input
    if (window.Prism) {
      // Small delay to ensure content is updated
      setTimeout(() => {
        Prism.highlightElement(codeEditor);
      }, 10);
    }
  });

  // Handle paste events
  codeEditor.addEventListener('paste', (e) => {
    e.preventDefault();

    // Get pasted text
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');

    // Insert at cursor position
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(pastedText));

    // Re-highlight
    if (window.Prism) {
      setTimeout(() => {
        Prism.highlightElement(codeEditor);
      }, 10);
    }
  });
}

// Load Pyodide script dynamically
function loadPyodide(config) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${config.indexURL}pyodide.js`;
    script.onload = () => {
      window.loadPyodide(config).then(resolve).catch(reject);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Initialize code runner when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeCodeRunner();
});
