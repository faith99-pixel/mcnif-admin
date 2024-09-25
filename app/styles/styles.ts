export const styles = {
  linkButton:
    'flex items-center gap-2 text-white text-sm bg-primary font-medium py-3 px-6 rounded-full hover:bg-primary-foreground hover:text:bg-primary',
  cardLinkButton:
    'cursor-pointer flex items-center justify-center gap-1 hover:opacity-40',
  checkBox: (checked: boolean) =>
    `border-[1px] border-primary outline-none appearance-none bg-white w-4 h-4 cursor-pointer rounded-md ${
      checked ? '!bg-primary' : ''
    }`,
  date: 'h-fit py-[2px] px-4 placeholder:text-sm font-semibold overflow-hidden text-base !rounded-[10px] w-full bg-white border border-primary outline-none sm:text-sm placeholder:text-mcNiff-light-gray-3',
  menuBlurPseudoStyle:'px-5 py-2 md:px-7 text-sm text-white bg-white bg-opacity-20 backdrop-blur-4xl border border-[#FBF9F4] rounded-[10px]'
};