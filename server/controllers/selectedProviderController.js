let lastSelectedProviders = []; // memory store

const handleSelectedProviders = (req, res) => {
  const { providers, country } = req.body;

  if (!providers || !Array.isArray(providers) || providers.length === 0) {
    return res.status(400).json({ error: 'No providers selected' });
  }

  lastSelectedProviders = providers;

  console.log(`Selected providers for ${country}:`, providers);

  res.status(200).json({
    message: 'Providers received successfully',
    providers,
    country,
  });
};


const getSelectedProviders = (req, res) => {
  res.status(200).json({ providers: lastSelectedProviders });
};

module.exports = {
  handleSelectedProviders,
  getSelectedProviders,
};
