import { html } from '@atomicjolt/lti-endpoints';
import viteHmrHtml from './vite_hmr_html';

export default function launchHtml(scriptName: string) {
  const head = `
    ${viteHmrHtml()}
  `;
  const body = `
    <div id="error" class="hidden u-flex aj-centered-message">
      <i class="material-icons-outlined aj-icon" aria-hidden="true">warning</i>
      <p class="aj-text translate">
        There was an error launching the LTI tool. Please reload and try again.
      </p>
    </div>
    <div id="main-content">
    Hello World
    </div>
    <script type="module" src="/${scriptName}"></script>
  `;
  return html(head, body);
}
