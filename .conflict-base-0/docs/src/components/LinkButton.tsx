import {Button, type ButtonProps} from '@repo/ui/components/button'
interface LinkButtonProps {
	href: string;
	text: string;
	variant: ButtonProps['variant'];
	
}
export default function LinkButton({text, variant = 'default', href}: LinkButtonProps){
	return <Button asChild variant={variant}>
		<a className="no-underline" href={href}>{text}</a>
	</Button>
}
