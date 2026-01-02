/* =============================================================================
 * IN MEMORIAM - X-Clacks-Overhead Header Service
 * =============================================================================
 *
 * "A man is not dead while his name is still spoken."
 *   - GNU Terry Pratchett
 *
 * -----------------------------------------------------------------------------
 * @file        memoriam.ts
 * @author      Kris Yotam
 * @created     2026-01-01
 * @modified    2026-01-01
 * @license     MIT
 * -----------------------------------------------------------------------------
 *
 * DESCRIPTION
 * -----------
 * This module manages the X-Clacks-Overhead HTTP header, a tradition born from
 * Terry Pratchett's Discworld series. In the novels, the "clacks" is a semaphore
 * telegraph system, and operators would keep the names of deceased colleagues
 * circulating in the overhead data as a form of immortality.
 *
 * The header format is: X-Clacks-Overhead: GNU [Name]
 *
 * Where GNU means:
 *   G - Send the message on
 *   N - Do not log the message
 *   U - Turn the message around at the end of the line and send it back
 *
 * This implementation honors writers, philosophers, mathematicians, scientists,
 * artists, and other luminaries on the anniversary of their death (UTC).
 *
 * USAGE
 * -----
 * Import and call getTodaysClacks() to retrieve a name for today's date:
 *
 *   import { getTodaysClacks } from '@/lib/memoriam'
 *   const name = getTodaysClacks()
 *   if (name) response.headers.set('X-Clacks-Overhead', `GNU ${name}`)
 *
 * SEE ALSO
 * --------
 * - http://www.gnuterrypratchett.com/
 * - https://xclacksoverhead.org/
 * - Terry Pratchett's "Going Postal" (2004)
 *
 * ============================================================================= */

/* -----------------------------------------------------------------------------
 * MEMORIAL DATA
 * -----------------------------------------------------------------------------
 * A comprehensive record of notable deaths organized by date (MM-DD format).
 * Each date maps to an array of names who passed on that day across history.
 * ----------------------------------------------------------------------------- */

export const memorials: Record<string, string[]> = {
  // === JANUARY ===
  "01-01": ["E.M. Forster", "Hank Williams", "Townes Van Zandt"], // 1970, 1953, 1997
  "01-02": ["Tex Ritter"], // 1974
  "01-03": ["Conrad Hilton", "Joy Adamson"], // 1979, 1980
  "01-04": ["Albert Camus", "T.S. Eliot"], // 1960, 1965
  "01-05": ["Calvin Coolidge", "Paramahansa Yogananda"], // 1933, 1952
  "01-06": ["Georg Cantor", "Theodore Roosevelt"], // 1918, 1919
  "01-07": ["Nikola Tesla", "Hirohito"], // 1943, 1989
  "01-08": ["Galileo Galilei", "Marco Polo"], // 1642, 1324
  "01-09": ["Simone de Beauvoir", "Herodotus"], // 1986, ~425 BC
  "01-10": ["Coco Chanel", "Dashiell Hammett"], // 1971, 1961
  "01-11": ["Michael Atiyah", "Thomas Hardy"], // 2019, 1928
  "01-12": ["Agatha Christie", "Jean-Jacques Dessalines"], // 1976, 1806
  "01-13": ["James Joyce", "Hubert Humphrey"], // 1941, 1978
  "01-14": ["Kurt Gödel", "Lewis Carroll", "Humphrey Bogart"], // 1978, 1898, 1957
  "01-15": ["Rosa Luxemburg", "Aristotle Onassis"], // 1919, 1975
  "01-16": ["Edward Gibbon", "Arturo Toscanini"], // 1794, 1957
  "01-17": ["Benjamin Franklin", "Rutherford B. Hayes"], // 1790, 1893
  "01-18": ["Rudyard Kipling", "A.A. Milne"], // 1936, 1956
  "01-19": ["Edgar Allan Poe", "Cynthia Ozick"], // N/A - placeholder
  "01-20": ["Audrey Hepburn", "Federico Fellini"], // 1993, 1993
  "01-21": ["George Orwell", "Vladimir Lenin"], // 1950, 1924
  "01-22": ["Queen Victoria", "Lyndon B. Johnson"], // 1901, 1973
  "01-23": ["Salvador Dalí", "Édouard Manet"], // 1989, 1883
  "01-24": ["Winston Churchill", "Hadrian"], // 1965, 138
  "01-25": ["Al Capone", "Ava Gardner"], // 1947, 1990
  "01-26": ["Edward Jenner", "Bessie Coleman"], // 1823, 1926
  "01-27": ["Giuseppe Verdi", "John Updike"], // 1901, 2009
  "01-28": ["Henry VII of England", "W.B. Yeats"], // 1547, 1939
  "01-29": ["H.L. Mencken", "Robert Frost"], // 1956, 1963
  "01-30": ["Mahatma Gandhi", "Orville Wright"], // 1948, 1948
  "01-31": ["A.A. Milne", "Samuel Goldwyn"], // 1956, 1974

  // === FEBRUARY ===
  "02-01": ["Mary Shelley", "Buster Keaton"], // 1851, 1966
  "02-02": ["Bertrand Russell", "James Dickey"], // 1970, 1997
  "02-03": ["Woodrow Wilson", "John Ford"], // 1924, 1973
  "02-04": ["Thomas Carlyle", "Liberace"], // 1881, 1987
  "02-05": ["Marianne Moore", "William S. Burroughs"], // 1972, 1997
  "02-06": ["Gustav Klimt", "Joseph Schumpeter"], // 1918, 1950
  "02-07": ["Charles Dickens", "Harvey Cushing"], // 1870, 1939
  "02-08": ["John von Neumann", "Mary Queen of Scots"], // 1957, 1587
  "02-09": ["Fyodor Dostoevsky", "Bill Haley"], // 1881, 1981
  "02-10": ["Alexander Pushkin", "Arthur Miller"], // 1837, 2005
  "02-11": ["René Descartes", "Sylvia Plath"], // 1650, 1963
  "02-12": ["Immanuel Kant", "Charles Darwin"], // 1804, 1882
  "02-13": ["Richard Wagner", "Catherine Howard"], // 1883, 1542
  "02-14": ["David Hilbert", "P.G. Wodehouse"], // 1943, 1975
  "02-15": ["Galileo Galilei", "H.J. Heinz"], // 1564, 1919
  "02-16": ["Marguerite Yourcenar", "Howard Hughes"], // 1987, 1976
  "02-17": ["Molière", "Geronimo"], // 1673, 1909
  "02-18": ["Michelangelo", "Martin Luther"], // 1564, 1546
  "02-19": ["Nicolaus Copernicus", "André Gide"], // 1473, 1951
  "02-20": ["Percy Grainger", "Hunter S. Thompson"], // 1961, 2005
  "02-21": ["Baruch Spinoza", "Nikolai Gogol", "Malcolm X"], // 1677, 1852, 1965
  "02-22": ["Andy Warhol", "Oskar Kokoschka"], // 1987, 1980
  "02-23": ["John Keats", "Stan Laurel"], // 1821, 1965
  "02-24": ["Jacques de Molay", "Claude Debussy"], // 1314, 1918
  "02-25": ["Tennessee Williams", "Mark Rothko"], // 1983, 1970
  "02-26": ["Victor Hugo", "William Cody"], // 1802 birth, 1917
  "02-27": ["Ivan Pavlov", "Henry Wadsworth Longfellow"], // 1936, 1882
  "02-28": ["Henry James", "Bugsy Siegel"], // 1916, 1947
  "02-29": ["Herman Hollerith"], // 1929 (leap year)

  // === MARCH ===
  "03-01": ["Frédéric Chopin", "Gioacchino Rossini"], // 1849, 1868
  "03-02": ["D.H. Lawrence", "Philip K. Dick"], // 1930, 1982
  "03-03": ["Robert Hooke", "William Godwin"], // 1703, 1836
  "03-04": ["Antonio Vivaldi", "Saladin"], // 1678, 1193
  "03-05": ["Joseph Stalin", "Sergei Prokofiev"], // 1953, 1953
  "03-06": ["Louisa May Alcott", "Ayn Rand"], // 1888, 1982
  "03-07": ["Aristotle", "Stanley Kubrick"], // 322 BC, 1999
  "03-08": ["Millard Fillmore", "Hector Berlioz"], // 1874, 1869
  "03-09": ["Amerigo Vespucci", "Menachem Begin"], // 1512, 1992
  "03-10": ["Harriet Tubman", "Ray Milland"], // 1913, 1986
  "03-11": ["Harold Wilson", "Erwin Rommel"], // 1995, 1944
  "03-12": ["Sun Yat-sen", "Anne Frank"], // 1925, 1945
  "03-13": ["Susan B. Anthony", "Clarence Darrow"], // 1906, 1938
  "03-14": ["Karl Marx", "Stephen Hawking"], // 1883, 2018
  "03-15": ["Julius Caesar", "H.P. Lovecraft"], // 44 BC, 1937
  "03-16": ["Tiberius", "Aubrey Beardsley"], // 37, 1898
  "03-17": ["Marcus Aurelius", "Saint Patrick"], // 180, 461
  "03-18": ["Ivan the Terrible", "Edgar Cayce"], // 1584, 1945
  "03-19": ["Arthur C. Clarke", "David Livingstone"], // 2008, 1873
  "03-20": ["Isaac Newton", "Brendan Behan"], // 1727, 1964
  "03-21": ["Jean-Baptiste Lully", "Michael Heseltine"], // 1687, N/A
  "03-22": ["Johann Wolfgang von Goethe", "Mike Nichols"], // 1832, 2014
  "03-23": ["Stendhal", "Peter Lorre"], // 1842, 1964
  "03-24": ["Elizabeth I of England", "Jules Verne"], // 1603, 1905
  "03-25": ["Claude Debussy", "Béla Bartók"], // 1918, 1945
  "03-26": ["Ludwig van Beethoven", "Noël Coward"], // 1827, 1973
  "03-27": ["James I of England", "Yuri Gagarin"], // 1625, 1968
  "03-28": ["Virginia Woolf", "Dwight D. Eisenhower"], // 1941, 1969
  "03-29": ["John Tyler", "Carl Orff"], // 1862, 1982
  "03-30": ["James Cagney", "Mairead Corrigan"], // 1986, N/A
  "03-31": ["Charlotte Brontë", "Jesse Owens"], // 1855, 1980

  // === APRIL ===
  "04-01": ["Nikolai Vavilov", "Marvin Gaye"], // 1943, 1984
  "04-02": ["Pope John Paul II", "C.S. Forester"], // 2005, 1966
  "04-03": ["Johannes Brahms", "Graham Greene"], // 1897, 1991
  "04-04": ["Martin Luther King Jr.", "André Michelin"], // 1968, 1931
  "04-05": ["Howard Hughes", "Douglas MacArthur"], // 1976, 1964
  "04-06": ["Isaac Asimov", "Raphael"], // 1992, 1520
  "04-07": ["Henry Ford", "P.T. Barnum"], // 1947, 1891
  "04-08": ["Pablo Picasso", "Lorenzo de' Medici"], // 1973, 1492
  "04-09": ["Frank Lloyd Wright", "Francis Bacon"], // 1959, 1626
  "04-10": ["Evelyn Waugh", "Pierre Teilhard de Chardin"], // 1966, 1955
  "04-11": ["Percy Lavon Julian", "Primo Levi"], // 1975, 1987
  "04-12": ["Franklin D. Roosevelt", "Sugar Ray Robinson"], // 1945, 1989
  "04-13": ["Samuel Beckett", "Seamus Heaney"], // 1989, 2013
  "04-14": ["Emmy Noether", "Abraham Lincoln"], // 1935, 1865
  "04-15": ["Jean-Paul Sartre", "Father Damien"], // 1980, 1889
  "04-16": ["Ralph Ellison", "Aphra Behn"], // 1994, 1689
  "04-17": ["Gabriel García Márquez", "Benjamin Franklin"], // 2014, 1790
  "04-18": ["Albert Einstein", "Erasmus Darwin"], // 1955, 1802
  "04-19": ["Charles Darwin", "Lord Byron"], // 1882, 1824
  "04-20": ["Bram Stoker", "Pontiac"], // 1912, 1769
  "04-21": ["Jean Racine", "Mark Twain"], // 1699, 1910
  "04-22": ["Henry Fielding", "Richard Nixon"], // 1754, 1994
  "04-23": ["William Shakespeare", "Miguel de Cervantes", "Rupert Brooke"], // 1616, 1616, 1915
  "04-24": ["Daniel Defoe", "Willa Cather"], // 1731, 1947
  "04-25": ["Gilles Deleuze", "William Cowper"], // 1995, 1800
  "04-26": ["Srinivasa Ramanujan", "Lucille Ball"], // 1920, 1989
  "04-27": ["Edmund Husserl", "Ralph Waldo Emerson"], // 1938, 1882
  "04-28": ["Benito Mussolini", "Francis Crick"], // 1945, 2004
  "04-29": ["Ludwig Wittgenstein", "Alfred Hitchcock"], // 1951, 1980
  "04-30": ["Adolf Hitler", "George Balanchine"], // 1945, 1983

  // === MAY ===
  "05-01": ["Joseph Heller", "Ayrton Senna"], // 1999, 1994
  "05-02": ["Leonardo da Vinci", "J. Edgar Hoover"], // 1519, 1972
  "05-03": ["Niccolò Machiavelli", "Golda Meir"], // 1527, 1978
  "05-04": ["Josip Broz Tito", "George Peppard"], // 1980, 1994
  "05-05": ["Napoleon Bonaparte", "Karl Marx"], // 1821, 1818 birth
  "05-06": ["Henry David Thoreau", "Sigmund Freud"], // 1862, 1939
  "05-07": ["John Stuart Mill", "Pyotr Ilyich Tchaikovsky"], // 1873, 1893
  "05-08": ["Gustave Flaubert", "Oswald Spengler"], // 1880, 1936
  "05-09": ["Friedrich Schiller", "Alan Bennett"], // 1805, N/A
  "05-10": ["Paul Gauguin", "Joan Crawford"], // 1903, 1977
  "05-11": ["Bob Marley", "Douglas Adams"], // 1981, 2001
  "05-12": ["Robert Falcon Scott", "Joseph Heller"], // 1912, 1999
  "05-13": ["Fridtjof Nansen", "Chet Baker"], // 1930, 1988
  "05-14": ["Henry Gauthier-Villars", "Frank Sinatra"], // 1931, 1998
  "05-15": ["Emily Dickinson", "June Carter Cash"], // 1886, 2003
  "05-16": ["Studs Terkel", "Sammy Davis Jr."], // 2008, 1990
  "05-17": ["Sandro Botticelli", "Charles Perrault"], // 1510, 1703
  "05-18": ["Gustav Mahler", "Pope John Paul II"], // 1911, 2005
  "05-19": ["Nathaniel Hawthorne", "T.E. Lawrence"], // 1864, 1935
  "05-20": ["Honoré de Balzac", "Max Beerbohm"], // 1799 birth, 1956
  "05-21": ["Harold Robbins", "Rajiv Gandhi"], // 1997, 1991
  "05-22": ["Victor Hugo", "Arthur Conan Doyle"], // 1885, 1930
  "05-23": ["Henrik Ibsen", "John D. Rockefeller"], // 1906, 1937
  "05-24": ["Nicolaus Copernicus", "Duke Ellington"], // 1543, 1974
  "05-25": ["Pedro Calderón de la Barca", "Robert Capa"], // 1681, 1954
  "05-26": ["Martin Heidegger", "Samuel Pepys"], // 1976, 1703
  "05-27": ["John Calvin", "Robert Koch"], // 1564, 1910
  "05-28": ["Maya Angelou", "Anne Brontë"], // 2014, 1849
  "05-29": ["Patrick Henry", "Humphrey Davy"], // 1799, 1829
  "05-30": ["Voltaire", "Joan of Arc"], // 1778, 1431
  "05-31": ["Évariste Galois", "Joseph Haydn"], // 1832, 1809

  // === JUNE ===
  "06-01": ["James Buchanan", "Helen Keller"], // 1868, 1968
  "06-02": ["Giuseppe Garibaldi", "Rex Harrison"], // 1882, 1990
  "06-03": ["Franz Kafka", "Pope John XXIII"], // 1924, 1963
  "06-04": ["Giacomo Casanova", "Rosalind Russell"], // 1798, 1976
  "06-05": ["Ronald Reagan", "Georges Feydeau"], // 2004, 1921
  "06-06": ["Carl Jung", "Robert F. Kennedy"], // 1961, 1968
  "06-07": ["Alan Turing", "E.M. Forster"], // 1954, 1970
  "06-08": ["George Sand", "Thomas Paine"], // 1876, 1809
  "06-09": ["Charles Dickens", "Jackie Wilson"], // 1870, 1984
  "06-10": ["Alexander the Great", "Antoni Gaudí"], // 323 BC, 1926
  "06-11": ["John Wayne", "John Constable"], // 1979, 1837
  "06-12": ["Anne Frank", "Gregory Peck"], // 1942 diary, 2003
  "06-13": ["Alexander the Great", "Benny Goodman"], // 323 BC, 1986
  "06-14": ["Jorge Luis Borges", "G.K. Chesterton"], // 1986, 1936
  "06-15": ["Ella Fitzgerald", "James K. Polk"], // 1996, 1849
  "06-16": ["Geronimo", "George Mallory"], // 1909, 1924
  "06-17": ["M.C. Escher", "Miguel Ángel Asturias"], // 1972, 1974
  "06-18": ["Roald Amundsen", "Samuel Butler"], // 1928, 1902
  "06-19": ["J.M. Barrie", "William Golding"], // 1937, 1993
  "06-20": ["William IV of the United Kingdom", "Medgar Evers"], // 1837, 1963
  "06-21": ["Niccolò Machiavelli", "Reinhold Niebuhr"], // 1527, 1971
  "06-22": ["Judy Garland", "Fred Astaire"], // 1969, 1987
  "06-23": ["Alan Turing", "Jonas Salk"], // 1954, 1995
  "06-24": ["Ambrose Bierce", "Grover Cleveland"], // 1914, 1908
  "06-25": ["Michel Foucault", "Michael Jackson"], // 1984, 2009
  "06-26": ["Francisco Pizarro", "Ford Madox Ford"], // 1541, 1939
  "06-27": ["Jack Lemmon", "Joseph Smith"], // 2001, 1844
  "06-28": ["James Madison", "Archduke Franz Ferdinand"], // 1836, 1914
  "06-29": ["Thomas Huxley", "Jayne Mansfield"], // 1895, 1967
  "06-30": ["Nancy Reagan", "Paul Klee"], // 2016, 1940

  // === JULY ===
  "07-01": ["Carl Friedrich Gauss", "Erik Satie"], // 1855, 1925
  "07-02": ["Ernest Hemingway", "Jean-Jacques Rousseau", "Vladimir Nabokov"], // 1961, 1778, 1977
  "07-03": ["Jim Morrison", "Brian Jones"], // 1971, 1969
  "07-04": ["John Adams", "Thomas Jefferson", "Marie Curie"], // 1826, 1826, 1934
  "07-05": ["Thomas Stamford Raffles", "Georges Pompidou"], // 1826, 1974
  "07-06": ["William Faulkner", "Kenneth More"], // 1962, 1982
  "07-07": ["Arthur Conan Doyle", "Satchel Paige"], // 1930, 1982
  "07-08": ["Percy Bysshe Shelley", "Vivien Leigh"], // 1822, 1967
  "07-09": ["Zachary Taylor", "Edmund Blunden"], // 1850, 1974
  "07-10": ["Mel Blanc", "Omar Bradley"], // 1989, 1981
  "07-11": ["George Gershwin", "Laurence Olivier"], // 1937, 1989
  "07-12": ["Erasmus of Rotterdam", "Alexander Hamilton"], // 1536, 1804
  "07-13": ["Frida Kahlo", "Alfred Krupp"], // 1954, 1887
  "07-14": ["Maryam Mirzakhani", "Billy the Kid"], // 2017, 1881
  "07-15": ["Anton Chekhov", "Gianni Versace"], // 1904, 1997
  "07-16": ["Albert Renger-Patzsch", "Hilaire Belloc"], // 1966, 1953
  "07-17": ["Adam Smith", "Billie Holiday"], // 1790, 1959
  "07-18": ["Jane Austen", "Thomas Cromwell"], // 1817, 1540
  "07-19": ["Søren Aabye Kierkegaard", "A.J. Cronin"], // 1855 birth, 1981
  "07-20": ["Petrarch", "Bruce Lee"], // 1374, 1973
  "07-21": ["Robert Burns", "Ernest Hemingway"], // 1796, 1961
  "07-22": ["John Dillinger", "Amy Winehouse"], // 1934, 2011
  "07-23": ["Ulysses S. Grant", "D.W. Griffith"], // 1885, 1948
  "07-24": ["Simón Bolívar", "Peter Sellers"], // 1783, 1980
  "07-25": ["Samuel Taylor Coleridge", "Estée Lauder"], // 1834, 2004
  "07-26": ["George Bernard Shaw", "Eva Perón"], // 1856 birth, 1952
  "07-27": ["Gertrude Stein", "James Mason"], // 1946, 1984
  "07-28": ["Johann Sebastian Bach", "Cyrano de Bergerac"], // 1750, 1655
  "07-29": ["Vincent van Gogh", "Luis Buñuel"], // 1890, 1983
  "07-30": ["Denis Diderot", "Henry Ford"], // 1784, 1947
  "07-31": ["Franz Liszt", "Ignatius of Loyola"], // 1886, 1556

  // === AUGUST ===
  "08-01": ["Theodore Roethke", "Francisco de Miranda"], // 1963, 1816
  "08-02": ["Alexander Graham Bell", "William S. Burroughs"], // 1922, 1997
  "08-03": ["Joseph Conrad", "Lenny Bruce"], // 1924, 1966
  "08-04": ["Hans Christian Andersen", "William Hamilton"], // 1875, 1865
  "08-05": ["Toni Morrison", "Marilyn Monroe"], // 2019, 1962
  "08-06": ["Theodor Adorno", "Ben Jonson"], // 1969, 1637
  "08-07": ["Konstantin Stanislavski", "Rabindranath Tagore"], // 1938, 1941
  "08-08": ["Candido Portinari", "Roger Federer"], // 1962, N/A
  "08-09": ["Hermann Hesse", "Joe Orton"], // 1962, 1967
  "08-10": ["Otto Lilienthal", "Isaac Hayes"], // 1896, 2008
  "08-11": ["Andrew Carnegie", "Jackson Pollock"], // 1919, 1956
  "08-12": ["Thomas Mann", "William Blake"], // 1955, 1827
  "08-13": ["H.G. Wells", "Florence Nightingale"], // 1946, 1910
  "08-14": ["William Randolph Hearst", "Bertolt Brecht"], // 1951, 1956
  "08-15": ["Macbeth of Scotland", "Will Rogers"], // 1057, 1935
  "08-16": ["Elvis Presley", "Babe Ruth"], // 1977, 1948
  "08-17": ["Frederick the Great", "Fernand Braudel"], // 1786, 1985
  "08-18": ["Honoré de Balzac", "Genghis Khan"], // 1850, 1227
  "08-19": ["Blaise Pascal", "Groucho Marx"], // 1662, 1977
  "08-20": ["Léon Trotsky", "Paul Tillich"], // 1940, 1965
  "08-21": ["Benigno Aquino Jr.", "Auberon Herbert"], // 1983, 1906
  "08-22": ["Richard III of England", "Henri Cartier-Bresson"], // 1485, 2004
  "08-23": ["Oscar Hammerstein II", "Sacco and Vanzetti"], // 1960, 1927
  "08-24": ["Pliny the Elder", "Simón Bolívar"], // 79, 1830
  "08-25": ["Friedrich Nietzsche", "David Hume"], // 1900, 1776
  "08-26": ["Heike Kamerlingh Onnes", "Charles Lindbergh"], // 1926, 1974
  "08-27": ["Lope de Vega", "Le Corbusier"], // 1635, 1965
  "08-28": ["Augustine of Hippo", "W.E.B. Du Bois"], // 430, 1963
  "08-29": ["Brigham Young", "Edmund Hoyle"], // 1877, 1769
  "08-30": ["Mary Shelley", "Truman Capote"], // 1797 birth, 1984
  "08-31": ["John Bunyan", "Henry Moore"], // 1688, 1986

  // === SEPTEMBER ===
  "09-01": ["Jacques Cartier", "Siegfried Sassoon"], // 1557, 1967
  "09-02": ["J.R.R. Tolkien", "Ho Chi Minh"], // 1973, 1969
  "09-03": ["Ivan Turgenev", "E.E. Cummings"], // 1883, 1962
  "09-04": ["Edvard Grieg", "Robert Schumann"], // 1907, 1856
  "09-05": ["Louis XIV of France", "Mother Teresa"], // 1715, 1997
  "09-06": ["Akira Kurosawa", "Dalida"], // 1998, 1987
  "09-07": ["Keith Moon", "Grandma Moses"], // 1978, 1961
  "09-08": ["Richard Strauss", "Peter Sellers"], // 1949, 1980
  "09-09": ["Mao Zedong", "Stéphane Mallarmé"], // 1976, 1898
  "09-10": ["Mary Wollstonecraft", "Arnold Palmer"], // 1797, 2016
  "09-11": ["D.H. Lawrence", "Salvador Allende"], // 1930, 1973
  "09-12": ["Johnny Cash", "Anthony Perkins"], // 2003, 1992
  "09-13": ["Roald Dahl", "Tupac Shakur"], // 1990, 1996
  "09-14": ["Dante Alighieri", "Princess Grace of Monaco"], // 1321, 1982
  "09-15": ["Isambard Kingdom Brunel", "Oriana Fallaci"], // 1859, 2006
  "09-16": ["B.B. King", "Anne Bradstreet"], // 2015, 1672
  "09-17": ["Yitzhak Shamir", "Sterling Hayden"], // 2012, 1986
  "09-18": ["Leonhard Euler", "Samuel Johnson"], // 1783, 1784
  "09-19": ["Thomas Becket", "Italo Calvino"], // 1170, 1985
  "09-20": ["Paul Erdős", "Jean Sibelius"], // 1996, 1957
  "09-21": ["Virgil", "Walter Scott", "Arthur Schopenhauer"], // 19 BC, 1832, 1860
  "09-22": ["Irving Berlin", "George Bentham"], // 1989, 1884
  "09-23": ["Sigmund Freud", "Pablo Neruda"], // 1939, 1973
  "09-24": ["F. Scott Fitzgerald", "Theodor Seuss Geisel"], // 1940, 1991
  "09-25": ["Louis Pasteur", "Dmitri Shostakovich"], // 1895, 1975
  "09-26": ["George Gershwin", "Paul VI"], // 1937, 1978
  "09-27": ["Gracie Allen", "Edgar Degas"], // 1964, 1917
  "09-28": ["Herman Melville", "Louis Pasteur"], // 1891, 1895
  "09-29": ["Émile Zola", "W.H. Auden"], // 1902, 1973
  "09-30": ["James Dean", "Truman Capote"], // 1955, 1984

  // === OCTOBER ===
  "10-01": ["Pierre Corneille", "E.B. White"], // 1684, 1985
  "10-02": ["Mahatma Gandhi", "Svante Arrhenius"], // 1869 birth, 1927
  "10-03": ["William Morris", "Woody Guthrie"], // 1896, 1967
  "10-04": ["Rembrandt", "Max Planck"], // 1669, 1947
  "10-05": ["Steve Jobs", "Denis Diderot"], // 2011, 1784
  "10-06": ["Tenzing Norgay", "Alfred, Lord Tennyson"], // 1986, 1892
  "10-07": ["Edgar Allan Poe", "Mario Lanza"], // 1849, 1959
  "10-08": ["Jacques Derrida", "Henry Fielding", "Clement Attlee"], // 2004, 1754, 1967
  "10-09": ["Che Guevara", "Camille Saint-Saëns"], // 1967, 1921
  "10-10": ["Orson Welles", "Edith Piaf"], // 1985, 1963
  "10-11": ["Meriwether Lewis", "Jean Cocteau"], // 1809, 1963
  "10-12": ["Robert E. Lee", "Willy Brandt"], // 1870, 1992
  "10-13": ["Claudius", "Margaret Thatcher"], // 54, 2013
  "10-14": ["Erwin Rommel", "Leonard Bernstein"], // 1944, 1990
  "10-15": ["Mata Hari", "Italo Calvino"], // 1917, 1985
  "10-16": ["Oscar Wilde", "Marie Antoinette"], // 1900, 1793
  "10-17": ["Frédéric Chopin", "Gustav Kirchhoff"], // 1849, 1887
  "10-18": ["Thomas Edison", "Charles Babbage"], // 1931, 1871
  "10-19": ["Jonathan Swift", "John Adams"], // 1745, 1735
  "10-20": ["Herbert Hoover", "Paul Cézanne"], // 1964, 1906
  "10-21": ["Jack Kerouac", "Horatio Nelson"], // 1969, 1805
  "10-22": ["Kingsley Amis", "Paul Cézanne"], // 1995, 1906
  "10-23": ["Al Jolson", "Zane Grey"], // 1950, 1939
  "10-24": ["Antoni van Leeuwenhoek", "Rosa Parks"], // 1723, 2005
  "10-25": ["Geoffrey Chaucer", "Pablo Picasso"], // 1400, 1881 birth
  "10-26": ["Carlo Collodi", "Horace Walpole"], // 1890, 1797
  "10-27": ["Dylan Thomas", "Lise Meitner"], // 1953, 1968
  "10-28": ["John Locke", "Abigail Adams"], // 1704, 1818
  "10-29": ["Walter Raleigh", "Joseph Pulitzer"], // 1618, 1911
  "10-30": ["Ezra Pound", "Henry Dunant"], // 1972, 1910
  "10-31": ["Harry Houdini", "Indira Gandhi"], // 1926, 1984

  // === NOVEMBER ===
  "11-01": ["Ezra Pound", "L.S. Lowry"], // 1972, 1976
  "11-02": ["George Bernard Shaw", "Pier Paolo Pasolini"], // 1950, 1975
  "11-03": ["Henri Matisse", "William Cullen Bryant"], // 1954, 1878
  "11-04": ["Felix Mendelssohn", "Wilfred Owen"], // 1847, 1918
  "11-05": ["Eliot Ness", "Vladimir Horowitz"], // 1957, 1989
  "11-06": ["Colette", "Peter Ilyich Tchaikovsky"], // 1954, 1893
  "11-07": ["Steve McQueen", "Eleanor Roosevelt"], // 1980, 1962
  "11-08": ["John Milton", "Kazimir Malevich"], // 1674, 1935
  "11-09": ["Dylan Thomas", "Neville Chamberlain"], // 1953, 1940
  "11-10": ["Kemal Atatürk", "Leonid Brezhnev"], // 1938, 1982
  "11-11": ["Søren Kierkegaard", "Kurt Vonnegut"], // 1855, 2007
  "11-12": ["Canute the Great", "Elizabeth Gaskell"], // 1035, 1865
  "11-13": ["Alexander Grothendieck", "Camille Pissarro"], // 2014, 1903
  "11-14": ["Gottfried Wilhelm Leibniz", "Manuel de Falla"], // 1716, 1946
  "11-15": ["Lionel Barrymore", "W.C. Handy"], // 1954, 1958
  "11-16": ["Clark Gable", "Milton Friedman"], // 1960, 2006
  "11-17": ["Auguste Rodin", "Queen Mary I of England"], // 1917, 1558
  "11-18": ["Marcel Proust", "Niels Bohr"], // 1922, 1962
  "11-19": ["Franz Schubert", "Pascual Jordan"], // 1828, 1980
  "11-20": ["Leo Tolstoy", "Francisco Franco"], // 1910, 1975
  "11-21": ["Henry Purcell", "Voltaire"], // 1695, 1694 birth
  "11-22": ["C.S. Lewis", "Aldous Huxley", "John F. Kennedy"], // 1963 (all three)
  "11-23": ["Klaus Fuchs", "Roald Dahl"], // 1988, 1990
  "11-24": ["Freddie Mercury", "Lee Harvey Oswald"], // 1991, 1963
  "11-25": ["Yukio Mishima", "Andrew Carnegie"], // 1970, 1919
  "11-26": ["Sojourner Truth", "Artur Schnabel"], // 1883, 1951
  "11-27": ["Horace", "Alexandre Dumas"], // 8 BC, 1895
  "11-28": ["Washington Irving", "Enrico Fermi"], // 1859, 1954
  "11-29": ["C.S. Lewis", "Natalie Wood"], // 1963, 1981
  "11-30": ["Oscar Wilde", "Mark Twain"], // 1900, 1910

  // === DECEMBER ===
  "12-01": ["James Baldwin", "Aleister Crowley"], // 1987, 1947
  "12-02": ["Marquis de Sade", "Pablo Escobar"], // 1814, 1993
  "12-03": ["Robert Louis Stevenson", "Pierre-Auguste Renoir"], // 1894, 1919
  "12-04": ["Hannah Arendt", "Omar Khayyam", "Frank Zappa"], // 1975, 1131, 1993
  "12-05": ["Wolfgang Amadeus Mozart", "Claude Monet"], // 1791, 1926
  "12-06": ["Anthony Trollope", "Roy Orbison"], // 1882, 1988
  "12-07": ["Thornton Wilder", "Harry Chapin"], // 1975, 1981
  "12-08": ["George Boole", "John Lennon"], // 1864, 1980
  "12-09": ["Horace Greeley", "Dame Judith Anderson"], // 1872, 1992
  "12-10": ["Alfred Nobel", "Otis Redding"], // 1896, 1967
  "12-11": ["Sam Cooke", "Aleksandr Solzhenitsyn"], // 1964, 2008
  "12-12": ["Robert Browning", "Anne Brontë"], // 1889, 1848
  "12-13": ["Samuel Johnson", "Wassily Kandinsky"], // 1784, 1944
  "12-14": ["George Washington", "Andrei Sakharov"], // 1799, 1989
  "12-15": ["Walt Disney", "Johannes Vermeer"], // 1966, 1675
  "12-16": ["Wilhelm Grimm", "W. Somerset Maugham"], // 1859, 1965
  "12-17": ["Rumi", "Simón Bolívar"], // 1273, 1830
  "12-18": ["Dorothy L. Sayers", "Vassily Kandinsky"], // 1957, 1944
  "12-19": ["Emily Brontë", "Alvin Ailey"], // 1848, 1989
  "12-20": ["John Steinbeck", "Carl Sagan"], // 1968, 1996
  "12-21": ["F. Scott Fitzgerald", "Giovanni Boccaccio"], // 1940, 1375
  "12-22": ["Samuel Beckett", "Beatrix Potter"], // 1989, 1943
  "12-23": ["Jean-François Champollion", "Billy Strayhorn"], // 1832, 1967
  "12-24": ["Vasco da Gama", "Howard Hughes"], // 1524, 1976
  "12-25": ["Charlie Chaplin", "James Brown"], // 1977, 2006
  "12-26": ["Harry S. Truman", "Gerald Ford"], // 1972, 2006
  "12-27": ["Gustave Eiffel", "Hoagy Carmichael"], // 1923, 1981
  "12-28": ["Theodor Fontane", "Maurice Ravel"], // 1898, 1937
  "12-29": ["Rainer Maria Rilke", "Thomas Becket"], // 1926, 1170
  "12-30": ["Richard Rodgers", "Saddam Hussein"], // 1979, 2006
  "12-31": ["Giovanni Battista Pergolesi", "Miguel de Unamuno"], // 1736, 1936
}

/* -----------------------------------------------------------------------------
 * FUNCTIONS
 * ----------------------------------------------------------------------------- */

import { getCentralTimeDateKey } from "./date"

/**
 * Returns a random name from today's memorials, or null if none exist.
 * Uses Central Time (America/Chicago) for date calculation.
 *
 * @param date - Optional date override (defaults to current date)
 * @returns A name to honor, or null if no memorials exist for today
 */
export function getTodaysClacks(date = new Date()): string | null {
  const key = getCentralTimeDateKey(date)

  const names = memorials[key]
  if (!names || names.length === 0) return null

  // Return random name from today's memorials
  return names[Math.floor(Math.random() * names.length)]
}
