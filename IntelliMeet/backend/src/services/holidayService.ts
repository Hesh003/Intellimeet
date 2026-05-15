const NSBM_HOLIDAYS_2026 = [
  '2026-01-03', // Duruthu Full Moon Poya Day
  '2026-01-15', // Thai Pongal Day
  '2026-02-01', // Navam Full Moon Poya Day
  '2026-02-04', // Independence Day
  '2026-02-15', // Maha Shivaratri Day
  '2026-03-02', // Medin Full Moon Poya Day
  '2026-03-21', // Id-Ul-Fitr (Ramazan Festival Day)
  '2026-04-01', // Bak Full Moon Poya Day
  '2026-04-03', // Good Friday
  '2026-04-13', // Day Prior to Sinhala & Tamil New Year
  '2026-04-14', // Sinhala & Tamil New Year Day
  '2026-05-01', // Vesak Full Moon Poya Day & May Day
  '2026-05-02', // Day Following Vesak Poya Day
  '2026-05-28', // Id-Ul-Alha (Hadji Festival Day)
  '2026-05-30', // Adhi Poson Full Moon Poya Day
  '2026-06-29', // Poson Full Moon Poya Day
  '2026-07-29', // Esala Full Moon Poya Day
  '2026-08-26', // Milad-Un-Nabi (Holy Prophet’s Birthday)
  '2026-08-27', // Nikini Full Moon Poya Day
  '2026-09-26', // Binara Full Moon Poya Day
  '2026-10-25', // Vap Full Moon Poya Day
  '2026-11-08', // Deepavali Festival Day
  '2026-11-24', // Ill Full Moon Poya Day
  '2026-12-23', // Unduvap Full Moon Poya Day
  '2026-12-25', // Christmas Day
];

export const getSriLankaHolidays = async (year: number): Promise<string[]> => {
  if (year === 2026) {
    return NSBM_HOLIDAYS_2026;
  }
  
  // For other years, return empty or fallback logic
  return [];
};
