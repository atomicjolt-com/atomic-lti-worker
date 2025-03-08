import { html } from '@atomicjolt/lti-endpoints';
import {
  APPLICATION_NAME,
} from '../../definitions';

export default function indexHtml() {
  const head = '';
  const body = `
    <p class="aj-centered-message">
      <a class="aj-title" href="https://www.atomicjolt.com">${APPLICATION_NAME}</a>
    </p>
    <p id="main-content" class="aj-centered-message"></p>
  `;

  return html(head, body);
}
