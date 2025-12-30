/**
 * In Memoriam - X-Clacks-Overhead
 *
 * "A man is not dead while his name is still spoken."
 * - GNU Terry Pratchett
 *
 * This module manages the X-Clacks-Overhead header, honoring those
 * who have passed on their death anniversaries (UTC).
 */

export const memorials: Record<string, string[]> = {
  "01-04": ["Albert Camus"], // 1960
  "01-06": ["Georg Cantor"], // 1918
  "01-11": ["Michael Atiyah"], // 2019
  "01-13": ["James Joyce"], // 1941
  "01-14": ["Kurt Gödel", "Lewis Carroll"], // 1978, 1898
  "01-21": ["George Orwell"], // 1950
  "01-28": ["Virginia Woolf"], // 1941
  "02-02": ["Bertrand Russell"], // 1970
  "02-08": ["John von Neumann"], // 1957
  "02-09": ["Fyodor Dostoevsky"], // 1881
  "02-10": ["Alexander Pushkin"], // 1837
  "02-11": ["René Descartes"], // 1650
  "02-12": ["Immanuel Kant"], // 1804
  "02-14": ["David Hilbert"], // 1943
  "02-17": ["Molière"], // 1673
  "02-21": ["Baruch Spinoza", "Nikolai Gogol"], // 1677, 1852
  "03-14": ["Karl Marx"], // 1883
  "03-17": ["Marcus Aurelius"], // 180
  "03-20": ["Isaac Newton"], // 1727
  "03-22": ["Johann Wolfgang von Goethe"], // 1832
  "03-23": ["Stendhal"], // 1842
  "03-26": ["Walt Whitman"], // 1892
  "03-27": ["Ralph Waldo Emerson"], // 1882
  "03-28": ["Virginia Woolf"], // 1941
  "04-14": ["Emmy Noether", "Simone de Beauvoir"], // 1935, 1986
  "04-15": ["Jean-Paul Sartre"], // 1980
  "04-16": ["Ralph Ellison", "Aphra Behn"], // 1994, 1689
  "04-17": ["Gabriel García Márquez"], // 2014
  "04-19": ["Charles Darwin"], // 1882
  "04-21": ["Jean Racine"], // 1699
  "04-23": ["William Shakespeare", "Miguel de Cervantes"], // 1616
  "04-24": ["Daniel Defoe"], // 1731
  "04-26": ["Srinivasa Ramanujan"], // 1920
  "04-27": ["Edmund Husserl"], // 1938
  "04-29": ["Ludwig Wittgenstein"], // 1951
  "05-06": ["Henry David Thoreau"], // 1862
  "05-07": ["John Stuart Mill"], // 1873
  "05-09": ["Friedrich Schiller"], // 1805
  "05-14": ["Thomas Aquinas"], // 1274
  "05-15": ["Emily Dickinson"], // 1886
  "05-19": ["Nathaniel Hawthorne"], // 1864
  "05-22": ["Victor Hugo"], // 1885
  "05-25": ["Pedro Calderón de la Barca"], // 1681
  "05-26": ["Martin Heidegger"], // 1976
  "05-28": ["Maya Angelou"], // 2014
  "05-30": ["Voltaire"], // 1778
  "05-31": ["Évariste Galois"], // 1832
  "06-03": ["Franz Kafka"], // 1924
  "06-07": ["Alan Turing"], // 1954
  "06-08": ["George Sand"], // 1876
  "06-09": ["Charles Dickens"], // 1870
  "06-14": ["Jorge Luis Borges"], // 1986
  "06-21": ["Niccolò Machiavelli"], // 1527
  "06-25": ["Michel Foucault"], // 1984
  "07-02": ["Ernest Hemingway", "Jean-Jacques Rousseau", "Vladimir Nabokov"], // 1961, 1778, 1977
  "07-04": ["Samuel Richardson"], // 1761
  "07-06": ["William Faulkner"], // 1962
  "07-14": ["Maryam Mirzakhani"], // 2017
  "07-17": ["Jane Austen", "Henri Poincaré"], // 1817, 1912
  "07-18": ["Jane Austen"], // 1817
  "07-20": ["Petrarch"], // 1374
  "07-31": ["Denis Diderot"], // 1784
  "08-05": ["Toni Morrison"], // 2019
  "08-12": ["Thomas Mann"], // 1955
  "08-13": ["H.G. Wells"], // 1946
  "08-18": ["Honoré de Balzac"], // 1850
  "08-19": ["Blaise Pascal"], // 1662
  "08-25": ["Friedrich Nietzsche", "David Hume"], // 1900, 1776
  "08-27": ["Lope de Vega"], // 1635
  "08-28": ["Augustine of Hippo"], // 430
  "08-30": ["Mary Shelley"], // 1851
  "09-03": ["Ivan Turgenev"], // 1883
  "09-14": ["Dante Alighieri"], // 1321
  "09-18": ["Leonhard Euler", "Samuel Johnson"], // 1783, 1784
  "09-20": ["Paul Erdős"], // 1996
  "09-21": ["Virgil", "Walter Scott"], // 19 BC, 1832
  "09-28": ["Herman Melville"], // 1891
  "10-01": ["Pierre Corneille"], // 1684
  "10-07": ["Edgar Allan Poe"], // 1849
  "10-08": ["Jacques Derrida", "Henry Fielding"], // 2004, 1754
  "10-16": ["Oscar Wilde"], // 1900
  "10-19": ["Jonathan Swift"], // 1745
  "10-25": ["Geoffrey Chaucer"], // 1400
  "11-08": ["John Milton"], // 1674
  "11-09": ["Dylan Thomas"], // 1953
  "11-11": ["Søren Kierkegaard", "Kurt Vonnegut"], // 1855, 2007
  "11-13": ["Alexander Grothendieck"], // 2014
  "11-14": ["Gottfried Wilhelm Leibniz"], // 1716
  "11-18": ["Marcel Proust"], // 1922
  "11-20": ["Leo Tolstoy"], // 1910
  "11-22": ["C.S. Lewis", "Aldous Huxley", "John F. Kennedy"], // 1963 (all three)
  "11-27": ["Horace"], // 8 BC
  "11-30": ["Oscar Wilde", "Mark Twain"], // 1900, 1910
  "12-01": ["James Baldwin"], // 1987
  "12-04": ["Hannah Arendt", "Omar Khayyam"], // 1975, 1131
  "12-08": ["George Boole"], // 1864
  "12-17": ["Rumi"], // 1273
  "12-19": ["Emily Brontë"], // 1848
  "12-21": ["F. Scott Fitzgerald", "Giovanni Boccaccio"], // 1940, 1375
  "12-22": ["Samuel Beckett"], // 1989
  "12-25": ["Charlie Chaplin"], // 1977
}

/**
 * Returns a random name from today's memorials, or null if none exist.
 * Uses UTC time to ensure consistency across edge nodes.
 */
export function getTodaysClacks(date = new Date()): string | null {
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0")
  const dd = String(date.getUTCDate()).padStart(2, "0")
  const key = `${mm}-${dd}`

  const names = memorials[key]
  if (!names || names.length === 0) return null

  // Return random name from today's memorials
  return names[Math.floor(Math.random() * names.length)]
}
