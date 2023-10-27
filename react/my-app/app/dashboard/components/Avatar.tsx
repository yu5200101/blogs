export default function Avatar({
  person,
  size
}: {
  person: string,
  size: string
}) {
  return (<div>
    person: { person }
    size: { size }
  </div>)
}