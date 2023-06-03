interface Props {
  icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    title?: string | undefined;
    titleId?: string | undefined;
} & React.RefAttributes<SVGSVGElement>>
  label: string;
}

const IconButton = ({ icon: Icon, label: label }: Props) => {
  return (
    <button className="flex items-center space-x-2 hover:text-white">
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );
};

export default IconButton;
