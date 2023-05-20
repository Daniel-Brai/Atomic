const atomizeForm = document.getElementById('atomize_form');
const messageRenderer = document.getElementById('message-renderer');

function showToast(message, type) {
  if (type === 'success') {
    atomizeForm.reset();
    messageRenderer.classList.toggle('hidden');
    const messageIcon = document.getElementById('message-iconbox');
    const messageBox = document.getElementById('message-box');
    const unregistered_message_paragraph =
      document.getElementById('anonymous_user');
    messageIcon.innerHTML = `<svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd">
                                </path>
                            </svg>
                            <span class="sr-only">Check icon</span>`;
    messageBox.innerHTML = `
						<a id="message_link" class="text-gray-400 transition-colors hover:text-gray-600" href="${message}">${message}</a>
    `;
    unregistered_message_paragraph.innerHTML =
      'Sign up to increase the limit of your atomic links';
    const iconBox = document.getElementById('copyIcon');
    const copyBtn = document.getElementById('copybtn');
    const messageLink = document.getElementById('message_link');
    const copyIcon =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#6B7280"><path d="M20 2H10c-1.103 0-2 .897-2 2v4H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2v-4h4c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM4 20V10h10l.002 10H4zm16-6h-4v-4c0-1.103-.897-2-2-2h-4V4h10v10z"/></svg>';
    const checkIcon =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#6B7280"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"/></svg>';

    iconBox.innerHTML = copyIcon;
    const copyLink = async () => {
      try {
        await navigator.clipboard.writeText(messageLink.innerHTML);
        iconBox.innerHTML = checkIcon;
      } catch (e) {
        console.log(`Failed to copy link - ${messageLink} to clipboard!`);
      }
      setTimeout(() => {
        iconBox.innerHTML = copyIcon;
      }, 1500);
    };
    if (messageLink != null) {
      copyBtn.addEventListener('click', copyLink);
    }
  } else if (type === 'error') {
    messageRenderer.classList.toggle('hidden');
    const messageIcon = document.getElementById('message-iconbox');
    const messageBox = document.getElementById('message-box');
    messageIcon.innerHTML = `<svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                             <span class="sr-only">Warning icon</span>`;
    messageBox.innerHTML = `${message}`;
  }
}

atomizeForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const atomizeInput = document.getElementById('atomize_input').value;
  await fetch('/v1/api/data/atomize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      longUrl: atomizeInput,
    }),
  })
    .then((data) => data.json())
    .then((res) => {
      if (res['shortUrl']) {
        const link = `${location.origin}/${res['shortUrl']}`;
        showToast(link, 'success');
      } else if (Array.isArray(res['message']) && res['message'].length >= 0) {
        showToast(res['message'][0], 'error');
      } else {
        showToast(res['message'], 'error');
      }
    });
});
