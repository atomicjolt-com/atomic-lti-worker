import { html } from '@atomicjolt/lti-endpoints';
import {
  APPLICATION_NAME,
} from '../../definitions';

export default function indexHtml(scriptName: string) {
  const head = `
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">
    <style>
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0 auto;
        padding: 0;
        min-height: 100vh;
        color: #333;
        font-family: system-ui, -apple-system, sans-serif;
        line-height: 1.6;
      }

      code {
        background-color: #f4f4f4;
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-size: 0.9rem;
        font-weight: 900;
        padding: 1rem;
      }

      .header {
        background-color: #000;
        padding: 1rem 0;
        display: flex;
      }

      .header__container {
        margin: 0 auto;
        padding: 0 2rem;
        display: flex;
        align-items: center;
      }

      .header__logo {
        display: flex;
        align-items: center;
        text-decoration: none;
        gap: 0.5rem;
      }

      .hero-section {
        background-color: rgb(255, 221, 0);
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 4rem 2rem;
      }

      .hero-content {
        width: 100%;
        margin: 0 auto;
      }

      .hero-title {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        color: #000;
        line-height: 1.2;
      }

      .hero-description {
        font-size: 1.25rem;
        color: #000;
        margin-bottom: 2.5rem;
        line-height: 1.6;
        opacity: 0.8;
      }

      .hero-actions {
        margin-bottom: 1rem;
      }

      .content-section {
        background-color: #fff;
        padding: 4rem 2rem;
      }

      .info-section {
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 2rem;
      }

      .info-card {
        background: #fff;
        border: 1px solid #e1e1e1;
        border-radius: 8px;
        padding: 2rem;
        text-align: center;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .info-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      }

      .info-card h2 {
        color: #000;
        font-size: 1.5rem;
        margin-bottom: 1rem;
        font-weight: 600;
      }

      .info-card p {
        color: #666;
        line-height: 1.6;
        margin: 0;
      }

      .footer {
        background-color: #000;
        text-align: center;
        padding: 3rem 2rem;
      }

      .footer p {
        margin: 0;
        color: #fff;
        font-size: 1rem;
      }

      .footer-link {
        color: rgb(255, 221, 0);
        text-decoration: none;
        font-weight: 600;
        border-bottom: 2px solid transparent;
        transition: border-color 0.3s ease;
      }

      .footer-link:hover {
        border-bottom-color: rgb(255, 221, 0);
      }

      /* Button styling to match Atomic Jolt */
      .aj-btn {
        display: inline-flex;
        align-items: center;
        font-size: 1rem;
        padding: 1rem 2rem;
        text-decoration: none;
        border-radius: 6px;
        transition: all 0.3s ease;
        font-weight: 600;
        border: 2px solid #000;
        background-color: #000;
        color: #fff;
      }

      .aj-btn:hover {
        background-color: rgb(255, 221, 0);
        color: #000;
        border-color: #000;
        transform: translateY(-2px);
      }

      .aj-icon {
        margin-right: 0.5rem;
        font-size: 1.2rem;
      }

      @media (max-width: 768px) {
        .header__container {
          padding: 0 1rem;
        }

        .hero-title {
          font-size: 2.5rem;
        }

        .hero-description {
          font-size: 1.1rem;
        }

        .hero-section {
          padding: 3rem 1rem;
        }

        .content-section {
          padding: 3rem 1rem;
        }

        .info-section {
          gap: 1.5rem;
        }

        .info-card {
          padding: 1.5rem;
        }

        .footer {
          padding: 2rem 1rem;
        }
      }
    </style>
  `;
  const body = `
    <header class="header">
      <div class="header__container">
        <a href="/" class="header__logo">
          <img src="/images/atomicjolt_name.png" alt="atomic jolt logo icon" class="logo-icon">
        </a>
      </div>
    </header>

    <main>
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">${APPLICATION_NAME}</h1>
          <p class="hero-description">
            A powerful LTI tool built with modern web technologies and deployed on Cloudflare Workers.
          </p>
          <div id="main-content"></div>
        </div>
      </section>

      <section class="content-section">
        <div class="info-section">
          <div class="info-card">
            <h2>Open Source</h2>
            <p>MIT licensed open source project that you can freely use, modify, and distribute.</p>
            <p>
              <a href="https://github.com/atomicjolt-com/atomic-lti-worker" class="aj-btn" target="_blank" rel="noopener">
                View on GitHub
              </a>
            </p>
          </div>
          <div class="info-card">
            <h2>Modern Stack</h2>
            <p>Built with TypeScript, Hono, and Cloudflare Workers for maximum performance and scalability.</p>
          </div>
          <div class="info-card">
            <h2>LTI 1.3</h2>
            <p>Full support for the latest Learning Tools Interoperability standard with secure authentication.</p>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>
        Created with ❤️ by <a href="https://www.atomicjolt.com" class="footer-link">Atomic Jolt</a>
      </p>
    </footer>

    <script type="module" src="/${scriptName}"></script>
  `;

  return html(head, body);
}
