import styles from './index.module.scss'
import SearchBar from './components/SearchBar';

function Search() {
  return (
    <div className={styles.container}>
      <SearchBar />
    </div>
  );
}

export default Search