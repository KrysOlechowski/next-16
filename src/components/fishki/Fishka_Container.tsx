type Props = {
  text: [string, string];
};

export const FishkaContainer = ({ text }: Props) => {
  return (
    <div>
      <div>{text[0]}</div>
      <div>{text[1]}</div>
    </div>
  );
};
