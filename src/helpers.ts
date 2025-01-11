// Function to format code from string to display in a code block
export const formatCode = (code: string) => {
	function getLeadingTabsCount(str: string): number {
		const match = str.match(/^\n*(\t+)/);
		return match ? match[1].length : 0;
	}

	function cleanCode(code: string): string {
		// Get number of leading tabs from first line with content
		const lines = code.split('\\n');
		const firstContentLine = lines.find((line) => line.trim().length > 0) || '';
		const baseTabCount = getLeadingTabsCount(firstContentLine);

		return (
			code
				// Remove outer quotes
				.replace(/^"|"$/g, '')
				// Convert escaped chars to real ones
				.replace(/\\n/g, '\n')
				.replace(/\\t/g, '\t')
				.replace(/\\"/g, '"')
				// Remove excess tabs based on first line indentation
				.split('\n')
				.map((line) => line.replace(new RegExp(`^\t{${baseTabCount}}`), ''))
				.join('\n')
				// Trim start/end whitespace and newlines
				.trim()
		);
	}

	return cleanCode(code);
};

/**
 * Copies the specified text to the clipboard.
 *
 * @param {string} txt - The text to be copied to the clipboard.
 * @param {function} [copiedCallback] - Optional callback function to be executed after the text has been successfully copied.
 * @returns {Promise<void>} A promise that resolves when the text has been successfully copied to the clipboard.
 * @throws {Error} Throws an error if the Clipboard API is not available.
 */
export const copyToClipboard = async (txt: string, copiedCallback?: () => void): Promise<void> => {
	if (!navigator.clipboard) {
		return Promise.reject(new Error('Clipboard API not available'));
	}

	try {
		await navigator.clipboard.writeText(txt);
		if (copiedCallback) {
			copiedCallback();
		}
	} catch (err) {
		console.error('Failed to copy text: ', err);
	}
};
