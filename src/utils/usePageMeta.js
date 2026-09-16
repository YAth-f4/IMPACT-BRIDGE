import { useEffect } from 'react';

/**
 * Custom hook to dynamically update page title and meta description.
 * Ensures every route has an accurate, non-generic title and description.
 * 
 * @param {string} title - Page title (will append ' — Impact Bridge' if not already present)
 * @param {string} description - Meta description content for the page
 */
export function usePageMeta(title, description) {
  useEffect(() => {
    if (title) {
      const fullTitle = title.includes('Impact Bridge') 
        ? title 
        : `${title} — Impact Bridge`;
      document.title = fullTitle;
    }

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }
  }, [title, description]);
}

export default usePageMeta;
