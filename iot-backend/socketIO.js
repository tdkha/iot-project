
module.exports = (io) => {
    io.on('connection', (socket) => {
      socket.on('scanner_connected', (scanner_name) => {
        socket.join(`cashier_${scanner_name}`);
        console.log("-----------------------------");
        console.log(`A user joined room cashier_${scanner_name}`);
        console.log(`${scanner_name} connected`);
      });
  /*
      socket.on('product_added', ({ scanner_id, product_info }) => {
        console.log("-----------------------------");
        console.log(`Product added by scanner ${scanner_id}`);
        io.to(`cashier_${scanner_id}`).emit('product_added', product_info);
      });
  */
      socket.on('disconnect', () => {
        console.log("-----------------------------");
        console.log(`A scanner is  disconnected`);
      });
    });
  };