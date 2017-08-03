export class StringHandlers {
    public static titlify(title: string): string {
        let revised = title.charAt(0).toUpperCase();
        for (let i = 1; i < title.length; i++) {
            if (title.charAt(i - 1) === ' ') {
                revised += title.charAt(i).toUpperCase();
            } else {
                revised += title.charAt(i).toLowerCase();
            }
        }
        return revised;
    }
}
