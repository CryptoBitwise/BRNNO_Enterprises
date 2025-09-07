import '@testing-library/jest-dom';

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeInTheDocument(): R;
            toHaveClass(className: string): R;
            toHaveAttribute(attr: string, value?: string): R;
            toHaveTextContent(text: string): R;
            toBeVisible(): R;
            toBeDisabled(): R;
            toBeEnabled(): R;
            toHaveValue(value: string | number | string[]): R;
            toBeChecked(): R;
            toBePartiallyChecked(): R;
            toHaveDisplayValue(value: string | string[]): R;
            toHaveFormValues(expectedValues: Record<string, unknown>): R;
            toHaveAccessibleName(name: string): R;
            toHaveAccessibleDescription(description: string): R;
            toHaveFocus(): R;
            toHaveStyle(css: string | Record<string, unknown>): R;
        }
    }
}

export { }; 