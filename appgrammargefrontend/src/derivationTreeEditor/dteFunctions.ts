//dteFunctions.ts

//არ შეიძლება არავისთვის "წაშლის კანდიდატი" ჩანაწერის რედაქტირება ან წაშლა
//წაშლის კანდიდატზე შესაძლებელია, მხოლოდ დადასტურება ან უარყოფა
//ახალი ჩანაწერის შექმნა შეუძლია ყველას
//არსებული ჩანაწერის ბაზაში გაშვება, ან წაშლა შესაძლებელია მინიმუმ თუ ფორმის ინფორმაცია არსებობს
//და ასევე რომელიმე შემდეგ შემთხვევაში:
//1. თუ curRootIdVal არის 0 ან undefined. ეს ნიშნავს, რომ ჩანაწერი ეხლა იქმნება
//2. თუ ჩანაწერი სტატუსია ახალი (0) და მიმდინარე მომხმარებელი არის ამ ჩანაწერის მფლობელი
//3. თუ ჩანაწერი სტატუსია დამოწმებული (2) და მიმდინარე მომხმარებელს აქვს დამოწმების უფლება
export function isAllowEditAndDelete(
    currentId: number | undefined,
    userName: string | undefined,
    creator: string,
    recordStatusId: number,
    userHasConfirmRight: boolean
) {
    return (
        !!userName &&
        (!currentId ||
            (recordStatusId === 0 && creator === userName) ||
            (recordStatusId === 2 && userHasConfirmRight))
    );
}
