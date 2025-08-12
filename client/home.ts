const main = document.getElementById('main-content');
if (!main) {
  console.error('Main content element not found');
  throw new Error('Main content element not found');
}
main.innerHTML = `
  <div class="hero-actions">
    Register a Hello World LTI tool using <a href="https://www.imsglobal.org/spec/lti-dr/v1p0">Dynamic Registration</a>.
    <h3>Dynamic Registration URL:</h3>
    <code>https://atomic-lti-worker.atomicjolt.win/lti/register</code>
  </div>
`;