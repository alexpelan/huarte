// Much love to https://blog.callstack.io/unit-testing-react-native-with-the-new-jest-ii-redux-snapshots-for-your-actions-and-reducers-8559f6f8050b
// Mocking the global.fetch included in React Native
global.fetch = jest.fn();

// Helper to mock a success response (only once)
fetch.mockResponseSuccess = (body) => {
  fetch.mockImplementationOnce(
    () => Promise.resolve({ json: () => Promise.resolve(JSON.parse(body)) }),
  );
};

// Helper to mock a failure response (only once)
fetch.mockResponseFailure = (error) => {
  fetch.mockImplementationOnce(
    () => Promise.reject(error),
  );
};
