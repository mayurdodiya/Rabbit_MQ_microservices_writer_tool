module.exports = {
  //func for gen. slugId
  generateSlugId: async (input) => {
    try {
      // Remove special characters and spaces, replace with '-'
      let formattedString = input.replace(/[^a-zA-Z0-9]+/g, "-");
      // Convert to lowercase
      formattedString = formattedString.toLowerCase();
      // Remove leading and trailing '-' if any
      formattedString = formattedString.replace(/^-+|-+$/g, "");
      return formattedString;
    } catch (error) {
      return new Error("Failed the slugId!!!, plase try again later");
    }
  },
};
