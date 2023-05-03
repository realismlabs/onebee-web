// See here for how to edit this file easily
// https://docs.google.com/spreadsheets/d/1JKiFu2-gkaaCoWvYPQeSEztptxnJO-yUW0-pIDq6fD8/edit?usp=sharing
import {
  Activity,
  AddressBook,
  AirTrafficControl,
  Alien,
  ArrowCircleDown,
  ArrowCircleLeft,
  ArrowCircleRight,
  ArrowCircleUp,
  ArrowsHorizontal,
  ArrowsLeftRight,
  ArrowsMerge,
  ArrowsOut,
  Article,

  Atom,


  Bandaids,
  Bank,


  Bed,
  Bell,
  Book,

  Briefcase,
  Broom,
  Browser,

  Buildings,
  Car,
  ShoppingCart,
  ShoppingBag,
  Cardholder,
  Cards,
  Chair,


  CheckCircle,
  Circuitry,
  Clock,
  Cloud,


  CodeBlock,

  Coins,

  Command,

  CompassTool,
  ComputerTower,
  Confetti,
  Control,
  Cookie,
  Copy,
  Cpu,
  CreditCard,

  CurrencyCircleDollar,
  Cursor,
  Cylinder,
  Database,
  Desktop,

  Detective,

  Devices,
  Divide,



  Download,

  Drop,
  Ear,
  Eject,
  Elevator,
  Envelope,


  Globe,
  MapPin,


  Factory,
  File,
  Fingerprint,
  Fire,
  FireExtinguisher,
  FirstAid,

  Flag,




  Folder,


  Function,

  Gavel,

  Ghost,
  Gift,
  GitPullRequest,

  Goggles,
  Gradient,
  Hamburger,
  Hammer,
  Hand,
  Handbag,

  HashStraight,
  Headlights,
  Headphones,


  Hexagon,
  House,
  HouseLine,

  IdentificationCard,


  Info,

  Laptop,
  Layout,

  Lightbulb,
  Lighthouse,
  Lightning,


  ListBullets,
  ListChecks,

  ListMagnifyingGlass,
  ListNumbers,
  ListPlus,


  Magnet,






  MaskSad,
  MathOperations,



  Microphone,

  Money,
  Motorcycle,



  NavigationArrow,



  Notebook,
  NotePencil,



  PaperPlane,


  Parallelogram,
  Park,
  Path,




  Person,


  Phone,

  Pill,
  Pizza,
  Placeholder,
  Planet,
  Plant,
  Plug,


  Popcorn,


  Printer,
  Pulse,
  PushPin,

  Question,
  Radio,



  Record,
  Rectangle,





  Ruler,
  Shapes,
  Share,


  Sidebar,


  Skull,


  SmileyAngry,
  SmileyBlank,


  SmileySad,
  SmileySticker,

  SmileyXEyes,
  Sneaker,
  Snowflake,

  Sparkle,



  Square,

  Stairs,




  Sticker,



  Storefront,
  Sun,






  TennisBall,
  Tent,




  ThumbsUp,
  Ticket,


  Toolbox,




  Tray,

  Triangle,
  Trophy,
  Truck,
  Umbrella,

  User,

  UserGear,
  UserList,

  UserPlus,

  Users,
  UsersFour,
  UserSquare,
  UsersThree,

  Van,
  Vault,
  Video,
  VirtualReality,
  Virus,

  Wallet,

  Warning,

  Wine,


} from '@phosphor-icons/react';
import { Popover } from "@headlessui/react";
import React from "react";

const RenderIcon = ({ IconComponent, ...props }) => {
  return <IconComponent {...props} />;
};

const IconGrid = ({
  handleIconClick,
  selectedColor,
  searchTerm,
  selectedIcon,
}) => {
  const allIcons = [
    { name: 'Activity', icon: Activity },
    { name: 'AddressBook', icon: AddressBook },
    { name: 'AirTrafficControl', icon: AirTrafficControl },
    { name: 'Alien', icon: Alien },
    { name: 'ArrowCircleDown', icon: ArrowCircleDown },
    { name: 'ArrowCircleLeft', icon: ArrowCircleLeft },
    { name: 'ArrowCircleRight', icon: ArrowCircleRight },
    { name: 'ArrowCircleUp', icon: ArrowCircleUp },
    { name: 'ArrowsHorizontal', icon: ArrowsHorizontal },
    { name: 'ArrowsLeftRight', icon: ArrowsLeftRight },
    { name: 'ArrowsMerge', icon: ArrowsMerge },
    { name: 'ArrowsOut', icon: ArrowsOut },
    { name: 'Article', icon: Article },
    { name: 'Atom', icon: Atom },
    { name: 'Bandaids', icon: Bandaids },
    { name: 'Bank', icon: Bank },
    { name: 'Bed', icon: Bed },
    { name: 'Bell', icon: Bell },
    { name: 'Book', icon: Book },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'Broom', icon: Broom },
    { name: 'Browser', icon: Browser },
    { name: 'Buildings', icon: Buildings },
    { name: 'Car', icon: Car },
    { name: 'Cardholder', icon: Cardholder },
    { name: 'Cards', icon: Cards },
    { name: 'Chair', icon: Chair },
    { name: 'CheckCircle', icon: CheckCircle },
    { name: 'Circuitry', icon: Circuitry },
    { name: 'Clock', icon: Clock },
    { name: 'Cloud', icon: Cloud },
    { name: 'CodeBlock', icon: CodeBlock },
    { name: 'Coins', icon: Coins },
    { name: 'Command', icon: Command },
    { name: 'CompassTool', icon: CompassTool },
    { name: 'ComputerTower', icon: ComputerTower },
    { name: 'Confetti', icon: Confetti },
    { name: 'Control', icon: Control },
    { name: 'Cookie', icon: Cookie },
    { name: 'Copy', icon: Copy },
    { name: 'Cpu', icon: Cpu },
    { name: 'CreditCard', icon: CreditCard },
    { name: 'CurrencyCircleDollar', icon: CurrencyCircleDollar },
    { name: 'Cursor', icon: Cursor },
    { name: 'Cylinder', icon: Cylinder },
    { name: 'Database', icon: Database },
    { name: 'Desktop', icon: Desktop },
    { name: 'Detective', icon: Detective },
    { name: 'Devices', icon: Devices },
    { name: 'Divide', icon: Divide },
    { name: 'Download', icon: Download },
    { name: 'Drop', icon: Drop },
    { name: 'Ear', icon: Ear },
    { name: 'Eject', icon: Eject },
    { name: 'Elevator', icon: Elevator },
    { name: 'Envelope', icon: Envelope },
    { name: 'Factory', icon: Factory },
    { name: 'File', icon: File },
    { name: 'Fingerprint', icon: Fingerprint },
    { name: 'Fire', icon: Fire },
    { name: 'FireExtinguisher', icon: FireExtinguisher },
    { name: 'FirstAid', icon: FirstAid },
    { name: 'Flag', icon: Flag },
    { name: 'Folder', icon: Folder },
    { name: 'Function', icon: Function },
    { name: 'Gavel', icon: Gavel },
    { name: 'Ghost', icon: Ghost },
    { name: 'Gift', icon: Gift },
    { name: 'GitPullRequest', icon: GitPullRequest },
    { name: 'Goggles', icon: Goggles },
    { name: 'Gradient', icon: Gradient },
    { name: 'Hamburger', icon: Hamburger },
    { name: 'Hammer', icon: Hammer },
    { name: 'Hand', icon: Hand },
    { name: 'Handbag', icon: Handbag },
    { name: 'HashStraight', icon: HashStraight },
    { name: 'Headlights', icon: Headlights },
    { name: 'Headphones', icon: Headphones },
    { name: 'Hexagon', icon: Hexagon },
    { name: 'House', icon: House },
    { name: 'HouseLine', icon: HouseLine },
    { name: 'IdentificationCard', icon: IdentificationCard },
    { name: 'Info', icon: Info },
    { name: 'Laptop', icon: Laptop },
    { name: 'Layout', icon: Layout },
    { name: 'Lightbulb', icon: Lightbulb },
    { name: 'Lighthouse', icon: Lighthouse },
    { name: 'Lightning', icon: Lightning },
    { name: 'ListBullets', icon: ListBullets },
    { name: 'ListChecks', icon: ListChecks },
    { name: 'ListMagnifyingGlass', icon: ListMagnifyingGlass },
    { name: 'ListNumbers', icon: ListNumbers },
    { name: 'ListPlus', icon: ListPlus },
    { name: 'Magnet', icon: Magnet },
    { name: 'Globe', icon: Globe },
    { name: 'MapPin', icon: MapPin },
    { name: 'MaskSad', icon: MaskSad },
    { name: 'MathOperations', icon: MathOperations },
    { name: 'Microphone', icon: Microphone },
    { name: 'Money', icon: Money },
    { name: 'Motorcycle', icon: Motorcycle },
    { name: 'NavigationArrow', icon: NavigationArrow },
    { name: 'Notebook', icon: Notebook },
    { name: 'NotePencil', icon: NotePencil },
    { name: 'PaperPlane', icon: PaperPlane },
    { name: 'Parallelogram', icon: Parallelogram },
    { name: 'Park', icon: Park },
    { name: 'Path', icon: Path },
    { name: 'Person', icon: Person },
    { name: 'Phone', icon: Phone },
    { name: 'Pill', icon: Pill },
    { name: 'Pizza', icon: Pizza },
    { name: 'Placeholder', icon: Placeholder },
    { name: 'Planet', icon: Planet },
    { name: 'Plant', icon: Plant },
    { name: 'Plug', icon: Plug },
    { name: 'Popcorn', icon: Popcorn },
    { name: 'Printer', icon: Printer },
    { name: 'Pulse', icon: Pulse },
    { name: 'PushPin', icon: PushPin },
    { name: 'Question', icon: Question },
    { name: 'Radio', icon: Radio },
    { name: 'Record', icon: Record },
    { name: 'Rectangle', icon: Rectangle },
    { name: 'Ruler', icon: Ruler },
    { name: 'Shapes', icon: Shapes },
    { name: 'ShoppingCart', icon: ShoppingCart },
    { name: 'ShoppingBag', icon: ShoppingBag },
    { name: 'Share', icon: Share },
    { name: 'Sidebar', icon: Sidebar },
    { name: 'Skull', icon: Skull },
    { name: 'SmileyAngry', icon: SmileyAngry },
    { name: 'SmileyBlank', icon: SmileyBlank },
    { name: 'SmileySad', icon: SmileySad },
    { name: 'SmileySticker', icon: SmileySticker },
    { name: 'SmileyXEyes', icon: SmileyXEyes },
    { name: 'Sneaker', icon: Sneaker },
    { name: 'Snowflake', icon: Snowflake },
    { name: 'Sparkle', icon: Sparkle },
    { name: 'Square', icon: Square },
    { name: 'Stairs', icon: Stairs },
    { name: 'Sticker', icon: Sticker },
    { name: 'Storefront', icon: Storefront },
    { name: 'Sun', icon: Sun },
    { name: 'TennisBall', icon: TennisBall },
    { name: 'Tent', icon: Tent },
    { name: 'ThumbsUp', icon: ThumbsUp },
    { name: 'Ticket', icon: Ticket },
    { name: 'Toolbox', icon: Toolbox },
    { name: 'Tray', icon: Tray },
    { name: 'Triangle', icon: Triangle },
    { name: 'Trophy', icon: Trophy },
    { name: 'Truck', icon: Truck },
    { name: 'Umbrella', icon: Umbrella },
    { name: 'User', icon: User },
    { name: 'UserGear', icon: UserGear },
    { name: 'UserList', icon: UserList },
    { name: 'UserPlus', icon: UserPlus },
    { name: 'Users', icon: Users },
    { name: 'UsersFour', icon: UsersFour },
    { name: 'UserSquare', icon: UserSquare },
    { name: 'UsersThree', icon: UsersThree },
    { name: 'Van', icon: Van },
    { name: 'Vault', icon: Vault },
    { name: 'Video', icon: Video },
    { name: 'VirtualReality', icon: VirtualReality },
    { name: 'Virus', icon: Virus },
    { name: 'Wallet', icon: Wallet },
    { name: 'Warning', icon: Warning },
    { name: 'Wine', icon: Wine },
  ]

  // filter allIcons based on name
  const filteredIconNames = allIcons.filter((icon) =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {filteredIconNames.length > 0 && (
        <div
          className="grid gap-1 h-fit overflow-scroll w-[360px]"
          style={{
            gridTemplateColumns: "repeat(auto-fill, 24px)",
            gridTemplateRows: "repeat(auto-fill, 24px)",
          }}
        >
          {filteredIconNames.map((icon) => {
            return (
              <Popover.Button key={icon.name} className="cursor-default">
                <div
                  id={icon.name}
                  onClick={() => handleIconClick(icon.name)}
                  className={`flex items-center justify-center h-[24px] min-w-[24px] rounded hover:bg-white/10 cursor-default hover:brightness-200`}
                >
                  {/* color transition desired */}
                  <RenderIcon IconComponent={icon.icon} color={selectedColor} weight="fill" size={20} className="min-w-[24px] transition-colors duration-300" />
                </div>
              </Popover.Button>
            );
          })}
        </div>
      )}
      {filteredIconNames.length === 0 && (
        <div className="flex items-center justify-center w-[360px]">
          <p className="text-slate-11 text-[13px] mt-[48px]">No results found</p>
        </div>
      )}
    </>
  );
};

export default IconGrid;
