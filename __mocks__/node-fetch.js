const fetch = jest.fn(
  () =>
    new Promise((resolve) => {
      const response = { status: 200, ok: "ok" };
      resolve(response);
    })
);

export default fetch;
