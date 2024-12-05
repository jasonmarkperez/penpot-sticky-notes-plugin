import type { PluginMessageEvent } from './model';

penpot.ui.open('Sticky Notes Plugin', `?theme=${penpot.theme}`);

penpot.on('themechange', (theme) => {
  sendMessage({ type: 'theme', content: theme });
});

function sendMessage(message: PluginMessageEvent) {
  penpot.ui.sendMessage(message);
}

penpot.ui.onMessage<{ type: string; data: any }>(async (message) => {
  if (message.type === 'create-note') {
    const { content, includeNoteAuthor, color } = message.data
    const { currentUser } = penpot
    const noteColor = color ?? '#f0ff22'

    const board = penpot.createBoard()
    board.boardX = penpot.viewport.center.x
    board.boardY = penpot.viewport.center.y
    board.fills = [
      { fillOpacity: 1, fillColor: noteColor }
    ]
    board.shadows = [
      {
        style: 'drop-shadow',
        offsetX: 4,
        offsetY: 4,
        blur: 4,
        color: {
          color: "#000000",
          opacity: 0.2,
        },        
      }
    ]
    board.resize(300, 300)
    board.name = '📝 from ' + currentUser.name
    board.borderRadius = 8

    const verticalFlex = board.addFlexLayout();
    // Temporary fix for https://tree.taiga.io/project/penpot/issue/9407
    board.flex!.dir = "column"
    board.flex!.alignItems = "stretch"
    verticalFlex.dir = "column";
    verticalFlex.alignItems = "start";
    verticalFlex.justifyContent = "stretch";
    verticalFlex.verticalPadding = 16;
    verticalFlex.horizontalPadding = 16;
    verticalFlex.horizontalSizing = 'fill';
    verticalFlex.alignItems = "stretch";

    const text = penpot.createText(content);
    text!.growType = "auto-width"
    text!.fontSize = "18"
    
    board.appendChild(text!);

    text!.layoutChild!.horizontalSizing = 'fill'
    text!.layoutChild!.verticalSizing = 'fill'

    if (includeNoteAuthor) {
      const footer = penpot.createBoard()
      footer.name = 'Footer'
      footer.fills = [
        { fillOpacity: 0, fillColor: "#f0ff22" }
      ]
  
      const footerHorizontalFlex = footer.addFlexLayout();
      footer.flex!.dir = "row"
      footer.flex!.horizontalSizing = "fill"
      board.flex!.justifyContent = "stretch"
      // footer.horizontalSizing = "auto"
      footerHorizontalFlex.alignItems = "stretch";
      footerHorizontalFlex.dir = "row";
      footerHorizontalFlex.justifyContent = "space-between"
      footerHorizontalFlex.topPadding = 8
      footerHorizontalFlex.horizontalPadding = 16
  
  
      const authorName = penpot.createText(currentUser.name ?? '');
      authorName?.resize(150, 40);
      footer.appendChild(authorName!);
  
      const imageData = await penpot.uploadMediaData(
        'avatar', 
        base64ToUint8Array(currentUser.avatarUrl!),
        'image/png'
      )
      const avatar = penpot.createRectangle();
      avatar.resize(
        40,
        40
      );
      avatar.fills = [
        {
          fillOpacity: 1,
          fillImage:
          {
            ...imageData,
            keepApectRatio: true
          }
        },
      ];
      footer.appendChild(avatar);
      board.appendChild(footer);
  
  
      footer.layoutChild!.horizontalSizing = 'fill'
      footer.layoutChild!.verticalSizing = 'auto'
    }
    
    

    // const shape = penpot.createRectangle();
    // shape.boardX = penpot.viewport.center.x
    // shape.boardY = penpot.viewport.center.y


    // const textContainer = penpot.createBoard();
    // const text = penpot.createText(content);
    // textContainer.appendChild(text.);


    // const board = penpot.createBoard()
    // const flex = board.addFlexLayout()
    // flex.dir = "column";
    // flex.wrap = "wrap";
    // flex.alignItems = "center";
    // flex.justifyContent = "center";
    // flex.horizontalSizing = "fill";
    // flex.verticalSizing = "fill";

    // flex.appendChild(shape);
    // // flex.appendChild();

    
    // console.log(shape.layoutChild)
  }
});

function base64ToUint8Array(base64String:string) {
  const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const base64Data = base64String.replace(/^data:image\/png;base64,/, "");
  let len = base64Data.length;
  let bytes = [];

  for (let i = 0; i < len; i += 4) {
    let a = base64Chars.indexOf(base64Data[i]);
    let b = base64Chars.indexOf(base64Data[i + 1]);
    let c = base64Chars.indexOf(base64Data[i + 2]);
    let d = base64Chars.indexOf(base64Data[i + 3]);

    if (isNaN(a) || isNaN(b)) break;  // Handle potential padding

    let n1 = (a << 2) | (b >> 4);
    bytes.push(n1);

    if (!isNaN(c)) {
      let n2 = ((b << 4) & 0xFF) | (c >> 2);
      bytes.push(n2);

      if (!isNaN(d)) {
        let n3 = ((c << 6) & 0xFF) | d;
        bytes.push(n3);
      } else {
        //handle padding
      }
    } else {
      //handle padding
    }
  }

  return new Uint8Array(bytes);
}