import {
  useState
} from 'react'

function About() {
  let [value, setValue] = useState('')
  return (
    <div>
      <label>
        Enter some important data:
        <input
          name="data"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      <button type="submit">Save</button>
    </div>
  );
}

export default About