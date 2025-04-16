const main = document.getElementById('main-content');
if (!main) {
  console.error('Main content element not found');
  throw new Error('Main content element not found');
}
main.innerHTML = `
  <h1>Hello World</h1>
  <p>Welcome to the Atomic LTI Worker!</p>
`;